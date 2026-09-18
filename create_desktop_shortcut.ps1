$projectDirectory = Split-Path -Parent $PSCommandPath
$pythonRuntime = "C:\Users\Gabe\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
$iconPath = Join-Path $projectDirectory "logic-lab.ico"
$desktopDirectory = [Environment]::GetFolderPath("Desktop")
$shortcutPath = Join-Path $desktopDirectory "Logic Lab - Python Learning.lnk"

if (-not (Test-Path -LiteralPath $pythonRuntime)) {
    throw "The configured Python runtime was not found: $pythonRuntime"
}

Add-Type -AssemblyName System.Drawing
$bitmap = [System.Drawing.Bitmap]::new(128, 128)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.Clear([System.Drawing.Color]::FromArgb(23, 33, 58))

$mintBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(104, 224, 174))
$coralBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 143, 112))
$whiteBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::White)
$graphics.FillEllipse($mintBrush, 15, 15, 98, 98)
$graphics.FillEllipse($coralBrush, 88, 21, 19, 19)

$font = [System.Drawing.Font]::new("Segoe UI", 70, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$format = [System.Drawing.StringFormat]::new()
$format.Alignment = [System.Drawing.StringAlignment]::Center
$format.LineAlignment = [System.Drawing.StringAlignment]::Center
$graphics.DrawString("λ", $font, $whiteBrush, [System.Drawing.RectangleF]::new(4, 1, 118, 116), $format)

$temporaryPng = Join-Path $env:TEMP "logic-lab-icon.png"
$bitmap.Save($temporaryPng, [System.Drawing.Imaging.ImageFormat]::Png)
$pngBytes = [System.IO.File]::ReadAllBytes($temporaryPng)
$writer = [System.IO.BinaryWriter]::new([System.IO.File]::Open($iconPath, [System.IO.FileMode]::Create))
$writer.Write([uint16]0)
$writer.Write([uint16]1)
$writer.Write([uint16]1)
$writer.Write([byte]128)
$writer.Write([byte]128)
$writer.Write([byte]0)
$writer.Write([byte]0)
$writer.Write([uint16]1)
$writer.Write([uint16]32)
$writer.Write([uint32]$pngBytes.Length)
$writer.Write([uint32]22)
$writer.Write($pngBytes)
$writer.Close()

$format.Dispose()
$font.Dispose()
$whiteBrush.Dispose()
$coralBrush.Dispose()
$mintBrush.Dispose()
$graphics.Dispose()
$bitmap.Dispose()
Remove-Item -LiteralPath $temporaryPng

$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = $pythonRuntime
$shortcut.Arguments = 'server.py'
$shortcut.WorkingDirectory = $projectDirectory
$shortcut.IconLocation = "$iconPath,0"
$shortcut.Description = "Open the Logic Lab Python learning site"
$shortcut.Save()

Get-Item -LiteralPath $shortcutPath | Select-Object FullName, Length
