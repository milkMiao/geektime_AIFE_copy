const fs = require('fs');
const path = require('path');

// 定义训练集比例
const trainvalPercent = 0.8;    // 训练验证集占总数据的比例
const trainPercent = 0.7;       // 训练集占训练验证集的比例

const xmlfilepath = './dataSet/Annotations/'; 
const saveBasePath = './dataSet/ImageSets/Main/';  // 修改保存路径

// 创建必要的目录
function ensureDirectoryExistence(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

// 创建所需的目录
ensureDirectoryExistence(xmlfilepath);
ensureDirectoryExistence(saveBasePath);

// 复制XML文件到Annotations目录
if (fs.readdirSync(xmlfilepath).length === 0) {
    // 复制当前目录下的 xml 文件到 Annotations 目录
    if (fs.existsSync('3-10test.xml')) {
        fs.copyFileSync('3-10test.xml', path.join(xmlfilepath, '3-10test.xml'));
    }
}

// 获取xml文件列表
const totalXml = fs.readdirSync(xmlfilepath);
const num = totalXml.length;

if (num === 0) {
    console.error('No XML files found in', xmlfilepath);
    process.exit(1);
}

// 对于小数据集的特殊处理
let tv, tr;
if (num <= 3) {
    // 如果数据集很小，确保至少有一个样本在每个集合中
    tv = Math.max(1, num - 1);  // 至少留一个测试样本
    tr = Math.max(1, tv - 1);   // 至少留一个验证样本
} else {
    tv = Math.max(1, Math.round(num * trainvalPercent));  // 使用round代替floor
    tr = Math.max(1, Math.round(tv * trainPercent));      // 使用round代替floor
}

const list = Array.from({ length: num }, (_, i) => i);
const trainval = list.sort(() => 0.5 - Math.random()).slice(0, tv);
const train = trainval.sort(() => 0.5 - Math.random()).slice(0, tr);

console.log("总文件数:", num);
console.log("训练验证集大小:", tv);
console.log("训练集大小:", tr);
console.log("验证集大小:", tv - tr);
console.log("测试集大小:", num - tv);

// 创建文件写入流
const ftrainval = fs.createWriteStream(path.join(saveBasePath, 'trainval.txt'));
const ftest = fs.createWriteStream(path.join(saveBasePath, 'test.txt'));
const ftrain = fs.createWriteStream(path.join(saveBasePath, 'train.txt'));
const fval = fs.createWriteStream(path.join(saveBasePath, 'val.txt'));

// 写入数据
list.forEach(i => {
    const name = totalXml[i].slice(0, -4) + '\n';
    if (trainval.includes(i)) {
        ftrainval.write(name);
        if (train.includes(i)) {
            ftrain.write(name);
        } else {
            fval.write(name);
        }
    } else {
        ftest.write(name);
    }
});

// 关闭文件写入流
ftrainval.end();
ftrain.end();
fval.end();
ftest.end();

console.log('处理完成！文件已保存到:', saveBasePath);