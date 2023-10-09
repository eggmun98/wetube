console.log(__dirname); // 현재 파일의 절대경로를 알려줌
const path = require("path");

module.exports = {
  entry: "./src/client/js/main.js",
  mode: "development",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "assets", "js"),
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
        use: ["style-loader", "css-loader", "sass-loader"], // 로더를 역순으로 작성해야 함 => 웹팩은 뒤에서부터 시작하기
        // scss파일을 css로 변환시키고 그 코드들을 css-loader에 전달해 css를 js로 변환 시킨다
        // 마지막으로 style-loader가 js로 변환된 css를 dom에 전달 즉 브라우저에게 보이게 함
      },
    ],
  },
};
