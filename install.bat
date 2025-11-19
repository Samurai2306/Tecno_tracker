@echo off
echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Installation failed, trying with --legacy-peer-deps...
    call npm install --legacy-peer-deps
)
echo.
echo Installation complete! You can now run: npm start
pause

