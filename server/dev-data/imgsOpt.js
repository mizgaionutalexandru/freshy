const fs = require('fs');
const { exec } = require('child_process');
const folder = `${__dirname}/../public/imgs`;

const imgs = fs.readdirSync(folder); // Read the initial images

imgs.forEach((img) => {
  if (img === `cover.jpg`) return;

  const fileSize = fs.statSync(`${folder}/${img}`).size;
  const quality = 90.5 - (0.45 * fileSize) / 1000;
  console.log(`${img} - ${fileSize} - ${quality}`);
  if (fileSize <= 23 * 1024) return;

  const command = `npx @squoosh/cli --mozjpeg "{'quality':${quality}}" -d ${folder} ${folder}/${img}`;
  exec(command, (error, stdout) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    console.log(`✅✅ ${img} stdout: ${stdout}`);
  });
});
