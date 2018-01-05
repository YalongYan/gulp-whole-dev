# gulp-whole-dev
gulp给css js img 增加版本号 引用公共头尾

#直接 cnpm install 安装依赖 安装完之后

#打开node_modules\gulp-rev\index.js 

#第135行 manifest[originalFile] = revisionedFile; 

#更新为: manifest[originalFile] = originalFile + '?v=' + file.revHash;

#打开nodemodules\gulp-rev\nodemodules\rev-path\index.js

#10行 return filename + '-' + hash + ext;

#更新为: return filename + ext; 

#有的是箭头函数： 则 9行 

return modifyFilename(pth, (filename, ext) => ${filename}-${hash}${ext}); 

#改为 return modifyFilename(pth, (filename, ext) => ${filename}${ext});

#打开node_modules\gulp-rev-collector\index.js 

#40行的 let cleanReplacement = path.basename(json[key]).replace(new RegExp( opts.revSuffix ), '' ); 

#更新为: let cleanReplacement = path.basename(json[key]).split('?')[0]; 

#（代码可能稍微不同 原理不变的 适当调整）

#打开node_modules\gulp-rev-collector\index.js 
162行

changes.push({

regexp: new RegExp( prefixDelim + pattern, 'g' ),

patternLength: pattern.length,

replacement: '$1' + manifest[key]

});

#改为 
var afterDelim = '[?A-Za-z0-9_=]*';

changes.push({ regexp: new RegExp( prefixDelim + pattern+afterDelim, 'g' ), patternLength: pattern.length, replacement: '$1' + manifest[key] });

然后直接gulp 即可
访问地址  http://localhost:3000/html/index/index.html  

每次修改html css  js img  都会重新执行任务  但是不带版本号  
发布的时候  重新执行一次gulp   就会加上静态资源的版本号
