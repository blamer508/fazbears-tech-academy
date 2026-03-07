param(
    [string]$Token
)

# Build the static assets
Write-Output "Running build..."
npm run vercel-build

# Determine Vercel command
$scope = 'blamer508'
$cmd = 'npx vercel --prod --confirm --scope ' + $scope
if ($Token -and $Token.Trim() -ne '') {
    $cmd += ' --token ' + $Token
}

Write-Output "Deploying to Vercel (scope: $scope)..."

# Invoke the command and stream output
Invoke-Expression $cmd

if ($LASTEXITCODE -ne 0) {
    Write-Error "Vercel deploy failed with exit code $LASTEXITCODE"
    exit $LASTEXITCODE
} else {
    Write-Output "Vercel deploy finished successfully."
}
