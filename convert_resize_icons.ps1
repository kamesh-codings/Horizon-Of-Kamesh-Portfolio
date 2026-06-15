# PowerShell script to convert JPEG icons to 32x32 PNG
$iconsDir = "C:\Users\kamesh\OneDrive\Desktop\Kamesh  Portfolio\Icons"
$targetSize = 32

Get-ChildItem -Path $iconsDir -Filter "*.jpeg" | ForEach-Object {
    $jpegPath = $_.FullName
    $pngPath  = [System.IO.Path]::ChangeExtension($jpegPath, ".png")
    # Load original image
    $original = [System.Drawing.Image]::FromFile($jpegPath)
    # Create new bitmap with target size
    $bitmap = New-Object System.Drawing.Bitmap $targetSize, $targetSize
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.DrawImage($original, 0, 0, $targetSize, $targetSize)
    # Save as PNG
    $bitmap.Save($pngPath, [System.Drawing.Imaging.ImageFormat]::Png)
    # Cleanup
    $graphics.Dispose()
    $bitmap.Dispose()
    $original.Dispose()
    Write-Host "Converted $($_.Name) to $(Split-Path $pngPath -Leaf)"
}
