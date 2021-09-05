# gulp를 이용한 번들링 및 브라우저 
## gulp란
1. 자바스크립트 빌드 자동화 툴이다. (gulp.js) 
2. js파일을 수정 할 때 마다 서버를 재시작 할 수 있다.

clone 받을시 npm insatll 또는 yarn 후에 gulp start를 하면 실행 할 수 있음. 안될시 아래 babel과 gulp를 설치해주길 바람.

* package.json 생성
    * npm init -y // package.json 생성

* express설치 // 안해도 무관.
    * npm install express-generator -g
    * express --view=pug myapp 구조자동생성

* babel설치
    * npm install --save-dev @babel/core @babel/cli => //babel-core babel-cli 설치

* gulp //설치 무조건 전역에... 안하면 난리난다 나중에
    * npm install gulp-cli --global

```js
//gulp는 node.js 기반의 task runner 입니다. 반복적인 귀찮은 작업들이나 프론트엔드 빌드에 필요한 작업들을 gulp를 통해 쉽게 처리 할 수 있습니다.
//요청 후 결과를 한 번에 받는 방식이 아닌 스트림기반의 방식으로 이벤트마다 전달받는 방식을 이용하고 있습니다. 자바스크립트 자동화 빌드 시스템 입니다.

'use strict';
//'use strict';란 자바스크립트 코드의 안정성을 위하여 문법검사를 더 확실하게 하겠다는 의미입니다.
//gulpfile은 gulp에서 어떤 작업을 할 지 정의 해줍니다.

// import _ from '_' 는 var _ = require('_')의 es6문법입니다.

// var gulp = require('gulp');
import gulp from 'gulp'; //baelrc 사용 시
import uglify from 'gulp-uglify'; //es5
import uglifyes from 'gulp-uglify-es'; //es6이상
//gulp-uglify 플러그인을 사용하여 dist 디렉토리에 동일한 파일명으로 생성된 것을 볼 수 있습니다.
import concat from 'gulp-concat';
import cssminify from 'gulp-minify-css';
import htmlminify from 'gulp-minify-html';
import browserSync from 'browser-sync';

//gulp.task 메서드는 새로운 gulp task를 등록해주는 역할을 한다. 첫번쨰 파라미터에 task 이름, 두번째 파라미터에 실제 작업할 내용이 함수가 위치하게 된다.
// gulp.task('default', () =>{
//     return console.log("Gulp is running");
// });

gulp.task('hello', () => {
	return console.log("hello world!");
});

gulp.task('world', () => {
	return console.log("World");
});

//자바스크립트 경량화
//자바스크립트 파일에 포함된 주석, 공백 등을 제거하고 변수명 등을 짧게 바꾸는 등의 작업을 거쳐 용량을 줄이고 보다 빠르게 해석할 수 있도록 도와주게 합니다.
gulp.task('uglifyes', () => {
	return gulp.src('src/*.js') // src 폴더 아래의 모든 js파일을
    .pipe(uglifyes()) // minify(경량화) 해서
    .pipe(gulp.dest('dist')); // dist 폴더에 저장.
});

/*
    매번 gulp를 타이핑해서 task를 실행시켜 minify하는 방법은 비효율적이고 귀찮은 일입니다.
    이런 경우를 위해 파일에 변경이 있을 때마다 변경을 감지해서 task를 실행할 수 있는 기능을 gulp.watch 라는 메서드로 제공 해주고 있습니다.
*/

gulp.task('watch',() =>{
	gulp.watch('src/*.js', gulp.series('uglifyes'));
});

//series 사용 임의로 task들을 실행. series와 parallel을 조합하여 task들을 조합 할 수 있다.
const demo = gulp.series(gulp.parallel('uglifyes', 'watch'));
gulp.task('default', demo);

// minify된 파일들을 하나의 파일로 만들어서 배포하는 방법.
gulp.task('concat', () =>{
	return gulp.src('src/*.js') // src 폴더 아래의 모든 js파일을
    .pipe(concat('main.js')) // main.js라는 파일명으로 모두 병합한 뒤에
    // .pipe(uglify()) // minify(경량화) 해서
    .pipe(uglifyes()) // minify(경량화) 해서
    .pipe(gulp.dest('total')); // total 폴더에 저장.
});

//css파일 minify
gulp.task('cssminify', () =>{
  return gulp.src('src/css/main.css') // src/css 폴더의 main.css 파일을
    .pipe(cssminify()) // minify해서
    .pipe(gulp.dest('dist/css')); // dist/css 폴더에 저장
});

//BrowserSync로 미니 서버를 띄워서 작업하기
/*
    로컬에서 프론트엔드 작업을 할 때 웹서버를 띄워 결과물을 확인하게 되는데 코드를 수정 후 다시 빌드 후 웹서버에 접속하는
    방식을 BrowserSync를 사용하면 쉽게 자동화 할 수 있습니다.
    BrowserSync는 Gulp 플러그인이 아닌 node.js 기반 이기 때문에 -g 옵션으로 설치해도 됨.
*/

// 필요 한것은 여기.
//HTML 파일을 minify
gulp.task('brominifyhtml', () =>{
  return gulp.src('src/html/*.html') //src 폴더 아래의 모든 html 파일을
    .pipe(htmlminify()) //minify(경령화) 해서
    .pipe(gulp.dest('dist/html')) //dist 폴더에 저장
    .pipe(browserSync.reload({stream:true})); //broserSync로 브라우저에 반영
});

//javascript 파일을 minify uglifyes()로 자바스크립트를 통합시키고 경량화함
gulp.task('brouglify', () =>{
  return gulp.src('src/*.js')
    .pipe(concat('main.js'))
    .pipe(uglifyes())
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({stream:true}));
});

//CSS 파일을 minify
gulp.task('brominifycss', () =>{
  return gulp.src('src/css/*.css') //src 폴더 아래의 모든 css 파일을
    .pipe(concat('main.css')) //병합하고
    .pipe(cssminify()) //minify(경량화) 해서
    .pipe(gulp.dest('dist/css')) //dist 폴더에 저장
    .pipe(browserSync.reload({stream:true})); //browserSync 로 브라우저에 반영
});

//파일 변경 감지
/*
    gulp.watch
    gulp.watch는 첫번째 파라미터에서 변경 감지를 해야하는 대상을 지정한다.
    두번째 파라미터는 변경이 감지되었을 때 실행할 task를 지정한다. 배열 형태로 여러개의 task 명을 넣어주면 변경이 일어
    날 때마다 해당 task 들을 자동으로 실행해주게 된다.
*/
gulp.task('browatch', () =>{
	// index.html 추가.
  gulp.watch('index.html', gulp.series('brominifyhtml'));
  // gulp.watch('src/html/*.html', gulp.series('brominifyhtml'));
  gulp.watch('src/*.js', gulp.series('brouglify'));
  gulp.watch('src/css/*.css', gulp.series('brominifycss'));
});

gulp.task('server', gulp.series(gulp.parallel('brominifyhtml', 'brouglify','brominifycss'), ()=>{
  return browserSync.init({
    server: {
    	baseDir: './'
    }
  });
}));

//테스트 (gulp start로 시작)
gulp.task('start', gulp.series(gulp.parallel('server', 'browatch')));
```
