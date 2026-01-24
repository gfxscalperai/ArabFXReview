param(
  [string] $RemoteUrl = "",
  [string] $BranchName = "feature/news-ads-integration",
  [string] $CommitMessage = "chore: scaffold project + news/ads integration",
  [string] $PRTitle = "feat(news): integrate news & ads feed",
  [string] $PRBody = "",
  [switch] $OpenPR
)

function ExitWith($msg) { Write-Host $msg -ForegroundColor Red; exit 1 }

# تعيين نص عربي بعد تعريف المعاملات (لتجنّب مشاكل المعالج مع نصوص داخل param)
$defaultPRBody = @'
دمج قسم الأخبار والإعلانات، إضافة مكونات وبيانات، وCI workflow.
'@
if (-not $PRBody) { $PRBody = $defaultPRBody }

# 1) تحقق من وجود git
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Host "Git غير مثبت. ثبّت Git for Windows من: https://git-scm.com/download/win" -ForegroundColor Yellow
  Write-Host "أو عبر winget (إن كان متوفراً): winget install --id Git.Git -e --source winget" -ForegroundColor Yellow
  ExitWith "ثبّت Git ثم أعد تشغيل PowerShell وأعد المحاولة."
}

# 2) تهيئة repo إن لم تكن مهيأة
if (-not (Test-Path .git)) {
  git init
  Write-Host "Created new git repo."
}

# 3) إنشاء/الانتقال إلى الفرع
$existing = git branch --list $BranchName
if ($existing) { git checkout $BranchName }
else { git checkout -b $BranchName }

# 4) إضافة و commit
git add .
$porcelain = git status --porcelain
if (-not $porcelain) { Write-Host "لا تغييرات جديدة للالتزام." }
else {
  git commit -m $CommitMessage
  Write-Host "Committed changes."
}

# 5) إعداد remote origin إذا لزم
$originUrl = $null
try { $originUrl = git remote get-url origin 2>$null } catch {}
if (-not $originUrl) {
  if (-not $RemoteUrl) {
    $RemoteUrl = Read-Host "أدخل رابط الريموت (مثال: https://github.com/owner/repo.git)"
    if (-not $RemoteUrl) { ExitWith "لم تُقدّم رابط الريموت. الإنهاء." }
  }
  git remote add origin $RemoteUrl
  Write-Host "Added remote origin: $RemoteUrl"
}

# 6) دفع الفرع
git push -u origin $BranchName

# 7) إنشاء PR عبر gh إن أمكن
if (Get-Command gh -ErrorAction SilentlyContinue) {
  try {
    gh auth status 2>$null
    $pr = gh pr create --base main --head $BranchName --title $PRTitle --body $PRBody --label "feature,frontend" --web=false
    Write-Host "PR created: $pr" -ForegroundColor Green
    if ($OpenPR) { gh pr view --web }
    exit 0
  } catch {
    Write-Host "فشل إنشاء PR عبر gh أو غير مسجل الدخول. ستُطبع رابط المقارنة لإنشاء PR يدويًا." -ForegroundColor Yellow
  }
}

# 8) طباعة رابط المقارنة لإنشاء PR يدويًا
# محاولة استنتاج owner/repo من origin
$finalOrigin = git remote get-url origin
if ($finalOrigin -match "github.com[:/](?<owner>[^/]+)/(?<repo>[^/]+)(\.git)?$") {
  $owner = $Matches['owner']; $repo = $Matches['repo']
  $compareUrl = "https://github.com/$owner/$repo/compare/main...$BranchName?expand=1"
  Write-Host "افتح الرابط التالي لإنشاء PR يدويًا:" -ForegroundColor Green
  Write-Host $compareUrl -ForegroundColor Cyan
} else {
  Write-Host "لم أتمكن من استنتاج owner/repo من origin. استخدم واجهة GitHub لإنشاء PR يدويًا." -ForegroundColor Yellow
}
