const render = function (option: string):string{
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>前端每日必看</title>
  <link rel="icon" href="https://github.githubassets.com/favicons/favicon.svg" />
  <link rel="stylesheet" href="./public/style.css" />
  <script src="https://cdn.bootcdn.net/ajax/libs/dayjs/1.11.0/dayjs.min.js"></script>
  <script src="./public/main.js"></script>
</head>
<body>
  <div class="progress"></div>
  <a href="https://github.com/tcly861204" class="github-corner" title="Follow me on GitHub" aria-label="Follow me on GitHub" rel="noopener" target="_blank">
    <svg width="80" height="80" viewBox="0 0 250 250" aria-hidden="true">
      <path d="M0 0 115 115 130 115 142 142 250 250 250 0Z"></path>
      <path d="M128.3 109C113.8 99.7 119 89.6 119 89.6 122 82.7 120.5 78.6 120.5 78.6 119.2 72 123.4 76.3 123.4 76.3 127.3 80.9 125.5 87.3 125.5 87.3 122.9 97.6 130.6 101.9 134.4 103.2" fill="currentColor" style="transform-origin:130px 106px" class="octo-arm"></path>
      <path d="M115 115C114.9 115.1 118.7 116.5 119.8 115.4L133.7 101.6C136.9 99.2 139.9 98.4 142.2 98.6 133.8 88 127.5 74.4 143.8 58 148.5 53.4 154 51.2 159.7 51 160.3 49.4 163.2 43.6 171.4 40.1 171.4 40.1 176.1 42.5 178.8 56.2 183.1 58.6 187.2 61.8 190.9 65.4 194.5 69 197.7 73.2 200.1 77.6 213.8 80.2 216.3 84.9 216.3 84.9 212.7 93.1 206.9 96 205.4 96.6 205.1 102.4 203 107.8 198.3 112.5 181.9 128.9 168.3 122.5 157.7 114.1 157.9 116.9 156.7 120.9 152.7 124.9L141 136.5C139.8 137.7 141.6 141.9 141.8 141.8Z" fill="currentColor" class="octo-body"></path>
    </svg>
  </a>
  <header>
    <h1 class="title">前端每日必看</h1>
    <span id="date"></span>
  </header>
  ${option}
</body>
</html>
  `
}

export default render

export const Style = `
font-size: 16px;
color: #5fa207;
padding: 2px 6px;
border-radius: 3px;
margin: 0;
`