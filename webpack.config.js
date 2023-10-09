console.log(__dirname); // 현재 파일의 절대경로를 알려줌
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// 웹팩을 저장할 때마다 노디몬이 실행됨 고쳐야함 => nodemon.json 파일을 만들어서 설정을 하면됨

module.exports = {
  entry: "./src/client/js/main.js",
  mode: "development",
  watch: true, // 웹팩을 계속 실행시켜줌 그니까 서버를 계속 켜놓고 있음
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
  ],
  output: {
    filename: "js/main.js",
    path: path.resolve(__dirname, "assets"),
    clean: true, // clean는 옵션 폴더를 빌드를 시작하기 전에 클린 해주는거임
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"], // 로더를 역순으로 작성해야 함 => 웹팩은 뒤에서부터 시작하기
        // scss파일을 css로 변환시키고 그 코드들을 css-loader에 전달해 css를 js로 변환 시킨다
        // 마지막으로 style-loader가 js로 변환된 css를 dom에 전달 즉 브라우저에게 보이게 함
        // 위 방법은 js가 실행이 될때 까지 기다려야 화면이 그려지니까 안좋음
        // style.loader 대신 mini.loader를 사용하면 js와 css를 분리시켜줌
        // 즉 assets폴더 안에 css와 js파일이 나누어져 있음
      },
    ],
  },
};
