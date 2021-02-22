const compressing = require('compressing');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const remoteServer = 'https://ssos.live:3007/api/upload';


// 压缩为 zip
function zipFile(files, zip_name, callback, isIgnoreBase) {
    compressing.zip.compressDir(files, zip_name + '.zip', { ignoreBase: isIgnoreBase })
        .then(() => {
            callback(null, 'ok');
        })
        .catch(err => {
            console.error(err);
            callback(err);
        });
}


// 请求
function uploadFile(filepath) {
    let file = fs.createReadStream(filepath);

    let form = new FormData();

    form.append('file', file);

    const headers = form.getHeaders();

    console.log('开始部署至服务器');

    axios.post(remoteServer, form, {
        headers,
        onUploadProgress: e => {
            const { loaded, total } = e;
            // 使用本地 progress 事件
            if (e.lengthComputable) {
                let progress = loaded / total * 100;
                console.log('-----------------------------',progress);
            }
        }
    }).then(res => {
        if (res.data.code === 200 && res.data.state === true) {
            console.log('博客已成功部署至服务器');
            fs.unlinkSync(filepath);
            console.log('已删除blog.zip');
            console.log('已删除public');
        } else {
            console.log(`博客更新失败，${res.data.message}`);
        }
    })
}

// 调用压缩
zipFile(path.join(__dirname, 'public'), path.join(__dirname, 'blog'), function (err) {
    if (err) throw err;
    console.log('blog.zip 压缩成功');
    uploadFile(path.join(__dirname, 'blog.zip'));
}, true)
