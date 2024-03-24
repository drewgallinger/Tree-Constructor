const canvas = document.getElementById("treeVisualizer");
canvas.width =  1100;
canvas.height = 860;
canvas.style.backgroundColor = "#19191a" //

const ctx = canvas.getContext("2d");
const rect = canvas.getBoundingClientRect();


const resetButton = document.getElementById("resetButton");
const constructCodeButton = document.getElementById("constructButton");
const textOutput = document.getElementById("codeOutputBox");

let rootPlaced = false
const rootRadius = 30;
let listeningforNode = false;

let nodeCount = 1;
class Node {
    constructor(value, x, y) {
        this.value = value;
        this.subtrees = [];
        this.x = x
        this.y = y
        this.drawNode();
    }

    drawNode() {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "20px Arial";
        ctx.fillStyle = "#22224f";
        ctx.strokeStyle = "white";
        ctx.arc(this.x, this.y, rootRadius, 0, 2 * Math.PI);
        ctx.fill()
        ctx.fillStyle = "white";
        ctx.fillText(this.value, this.x, this.y);
        ctx.stroke();
        
    }

    createChild(event) {
        if (!listeningforNode) {
            let dydx = distance(this.x, this.y, event.clientX - rect.left, event.clientY - rect.top);
            if (dydx < rootRadius) {
                //console.log("Clicked on node: " + this.value)
                listeningforNode = true;
            }
        } else {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(event.clientX - rect.left, event.clientY - rect.top);
            ctx.stroke();
            this.drawNode();
            let child = new Node(nodeCount++, event.clientX - rect.left, event.clientY - rect.top);
            this.subtrees.push(child);
            NodeList.push(child);
            listeningforNode = false;
        }
    }
}

NodeList = []

var head;
var i = 0;

canvas.addEventListener("click", function(event) {
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    //console.log("Coordinate x: " + x, "Coordinate y: " + y);
    if (!rootPlaced) {
        head = new Node(nodeCount++, x, y);
        NodeList.push(head);
        rootPlaced = true;
    } else if (!listeningforNode) {
        for (i = 0; i < NodeList.length; i++) {
            NodeList[i].createChild(event);
            if (listeningforNode) {
                break;
            }
        }
    } else {
        NodeList[i].createChild(event);
    }
    
})



resetButton.addEventListener("click", function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    rootPlaced = false;
    nodeCount = 1;
    NodeList = [];
    listeningforNode = false;
    head = null;
    textOutput.innerHTML = "Click \"Construct Code\" to generate code";
});


constructCodeButton.addEventListener("click", function() {
    textOutput.innerHTML = createCode(head);
});


// Helper functions
function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function createCode(node) {
    let s = `Tree(${String(node.value)}, [`;
    for (const subtree of node.subtrees) {
      s += createCode(subtree) + ", ";
    }

    s = rstrip(s, ", ") + "])"; 
    return s;
}

function rstrip(str, chars = " ") {
    for (let i = str.length - 1; i >= 0; i--) {
      if (!chars.includes(str[i])) {
        return str.slice(0, i + 1);
      }
    }
    return str; 
}

/*
      /\_/\
 /\  / o o \
//\\ \~(*)~/
`  \/   ^ /    drew :)
   | \|| ||
   \ '|| ||
    \)()-())
*/