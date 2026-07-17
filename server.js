const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function fixPrefix(text) {
    if (!text) return text;

    return String(text)
        .replace(/पुत्र\s+/g, "S/O ")
        .replace(/पुत्री\s+/g, "D/O ")
        .replace(/पत्नी\s+/g, "W/O ")
        .replace(/पति\s+/g, "H/O ")
        .replace(/देखरेख\s+/g, "C/O ")
        .replace(/देखभाल\s+/g, "C/O ")
        .replace(/\bS\s*\/\s*O\b/gi, "S/O")
        .replace(/\bD\s*\/\s*O\b/gi, "D/O")
        .replace(/\bW\s*\/\s*O\b/gi, "W/O")
        .replace(/\bH\s*\/\s*O\b/gi, "H/O")
        .replace(/\bC\s*\/\s*O\b/gi, "C/O");
}

app.get("/", (req, res) => {
    res.send(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>BK Prefix API</title>
<style>
body{
font-family:Arial;
background:#111827;
color:white;
padding:30px;
}
textarea{
width:100%;
height:180px;
font-size:16px;
padding:10px;
}
button{
margin-top:10px;
padding:12px 20px;
font-size:16px;
cursor:pointer;
}
pre{
background:#1f2937;
padding:15px;
margin-top:20px;
border-radius:6px;
}
</style>
</head>
<body>

<h2>BK Prefix API</h2>

<textarea id="txt">{
  "house":"पुत्र राम कुमार",
  "street":"पत्नी सीमा",
  "landmark":"देखरेख मोहन"
}</textarea>

<br>

<button onclick="run()">Normalize</button>

<pre id="result"></pre>

<script>

async function run(){

const data=document.getElementById("txt").value;

const res=await fetch("/normalize",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:data
});

const json=await res.json();

document.getElementById("result").textContent=
JSON.stringify(json,null,4);

}

</script>

</body>
</html>
`);
});

app.post("/normalize", (req, res) => {

    let output = {};

    for (const key in req.body) {
        output[key] = fixPrefix(req.body[key]);
    }

    res.json({
        success: true,
        data: output
    });

});

app.get("/test", (req, res) => {

    res.json({
        house: fixPrefix("पुत्र राम कुमार"),
        street: fixPrefix("पत्नी सीमा"),
        landmark: fixPrefix("देखरेख मोहन")
    });

});

app.listen(PORT, () => {
    console.log("================================");
    console.log("BK Prefix API Running");
    console.log("PORT:", PORT);
    console.log("================================");
});