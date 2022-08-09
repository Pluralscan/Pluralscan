$NASM_VERSION="2.15.05" # or newer
$LINK="https://www.nasm.us/pub/nasm/releasebuilds/$NASM_VERSION/win64"
Invoke-WebRequest -Uri "$LINK/nasm-$NASM_VERSION-win64.zip" -OutFile "C:\nasm\nasm-$NASM_VERSION-win64.zip"
Expand-Archive -Path "C:\nasm\nasm-$NASM_VERSION-win64.zip" -DestinationPath "C:\nasm"
# set path for the current sessions
set PATH="%PATH%;C:\nasm\nasm-2.15.05"