# Fix JSON files by removing trailing commas
$dialogueDir = "C:\Users\karth\OneDrive\Desktop\portfolio\src\data\The Broken Kingdom Dialogue"

Get-ChildItem "$dialogueDir\*.json" | ForEach-Object {
    Write-Host "Fixing: $($_.Name)"
    $content = Get-Content $_.FullName -Raw
    
    # Remove trailing commas before closing brackets/braces
    $content = $content -replace ',(\s*[\]\}])', '$1'
    
    # Write back to file
    Set-Content -Path $_.FullName -Value $content -NoNewline
    
    Write-Host "Fixed: $($_.Name)"
}

Write-Host "All JSON files have been fixed!"
