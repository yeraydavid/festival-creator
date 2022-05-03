
var canvasw = 1280;
var canvash = 1810;
var limit = canvasw * 0.8;
var separator = " - ";
var ctx;
var setup;
var offsetY;
var template = 0;

var festName;
var head;
var front;
var support;

var globalSetup = {
  titleOffset: 50,
  initOffset: 260,
  logoSize: 200,
  headlinesSize: 180,
  frontSize: 100,
  supportingSize: 70
}

var setups =  [
  {
    configName: "Default",
    festName: "CustomFest",
    head: "R.E.M.",
    front: "Pulp, Radiohead, Tori Amos, Kate Bush",
    support: "Suede, Foo Fighters, Super Furry Animals, Eels, Ocean Colour Scene, Lush, Cerys Matthews, Belle & Sebastian, Siouxsie & the Banshees, Pete Yorn",
  }
];

var templates =  [
  {
    name: "Rock",
    font: "'Goblin One'",
    back: "",
    titleAdjust: 0,
    titleOffset: 0,
    fontsAdjust: -20,
    fillColor: "#fff7a3",
    strokeColor: "#000000",
    strokeWidth: 10,
    shadowColor: "rgb(0,0,0)",
    shadowBlur: 20,
  },
  {
    name: "Epic Power Metal",
    font: "Cinzel",
    back: "",
    titleAdjust: 0,
    titleOffset: -65,
    fontsAdjust: -15,
    fillColor: "#FFFFFF",
    strokeColor: "#000000",
    strokeWidth: 6,
    shadowColor: "#000000",
    shadowBlur: 15,
  },
  {
    name: "Jazz",
    font: "Jost",
    back: "",
    titleAdjust: 0,
    titleOffset: 0,
    fontsAdjust: -20,
    fillColor: "#FFFFFF",
    strokeColor: "#000000",
    strokeWidth: 6,
    shadowColor: "#000000",
    shadowBlur: 15,
  },
  {
    name: "Classic Metal",
    font: "'Metal Mania'",
    back: "",
    titleAdjust: 0,
    titleOffset: 0,
    fontsAdjust: -10,
    fillColor: "#FFFFFF",
    strokeColor: "#000000",
    strokeWidth: 6,
    shadowColor: "#000000",
    shadowBlur: 15,
  },
  {
    name: "Post Rock",
    font: "'Poiret One'",
    back: "",
    titleAdjust: -10,
    titleOffset: 0,
    fontsAdjust: -10,
    fillColor: "#000000",
    strokeColor: "rgba(0,0,0,0)",
    strokeWidth: 0,
    shadowColor: "#000000",
    shadowBlur: 0,
  },
  {
    name: "Dance - Electronica",
    font: "'Zen Dots'",
    back: "",
    titleAdjust: 0,
    titleOffset: 50,
    fontsAdjust: -20,
    fillColor: "#FFFFFF",
    strokeColor: "#000000",
    strokeWidth: 16,
    shadowColor: "#000000",
    shadowBlur: 15,
  },
  {
    name: "Classical / Atmospheric Black",
    font: "'Crimson Text'",
    back: "",
    titleAdjust: 0,
    titleOffset: -20,
    fontsAdjust: 0,
    fillColor: "#505050",
    strokeColor: "#000000",
    strokeWidth: 0,
    shadowColor: "#000000",
    shadowBlur: 0,
  },
  {
    name: "Pop Rock",
    font: "Chicle",
    back: "",
    titleAdjust: 0,
    titleOffset: -50,
    fontsAdjust: 0,
    fillColor: "#FFFFFF",
    strokeColor: "#102748",
    strokeWidth: 10,
    shadowColor: "#102748",
    shadowBlur: 5,
  },
  {
    name: "Generic",
    font: "Lobster",
    back: "",
    titleAdjust: 0,
    titleOffset: 0,
    fontsAdjust: 0,
    fillColor: "#FFFFFF",
    strokeColor: "rgba(0,0,0,0.5)",
    strokeWidth: 5,
    shadowColor: "rgba(0,0,0,0.5)",
    shadowBlur: 15
  }
];

let adjustSize = function(startingSize, words) {
  let adjustedSize = startingSize;
  let measuredWidth
  words.forEach(word => {
    do {
      ctx.font = adjustedSize+"px "+templates[template].font;
      measuredWidth = ctx.measureText(word).width;
      if(measuredWidth > limit) {
        adjustedSize--;
      }
    } while(measuredWidth > limit)
  })
  return adjustedSize;
}

let initContext = function() {
  let canvas = $("#canvas")[0];
  ctx = canvas.getContext("2d");
  ctx.textAlign = 'center';
}

let fillValuesFromSetup = function() {
  $("#head").val(setup.head);
  $("#front").val(setup.front);
  $("#support").val(setup.support);
  $("#festName").val(setup.festName);
}

let getValuesFromInputs = function() {
  head = $("#head").val();
  front = $("#front").val();
  support = $("#support").val();
  festName = $("#festName").val();
}

let setTemplate = function() {
  template = $( "#template" ).val();
  ctx.fillStyle   = templates[template].fillColor;
  ctx.strokeStyle = templates[template].strokeColor;
  ctx.lineWidth   = templates[template].strokeWidth;
  ctx.shadowColor = templates[template].shadowColor;
  ctx.shadowBlur  = templates[template].shadowBlur;
}

let applyTemplate = function() {
  setTemplate();
  refreshCanvas();
}

let renderCanvas = function() {
  console.log("Change");
  getValuesFromInputs();
  refreshCanvas();
}

let renderBackground = function(callback) {
  let img = new Image;
  img.onload = function() {
    ctx.drawImage(img, 0,0);
    callback();
  }
  img.src = "template"+template+".jpg";
}

let refreshCanvas = function() {
  renderBackground(() => {
    renderTitle(festName);
    offsetY = renderBandsString(head, globalSetup.initOffset + templates[template].titleOffset, globalSetup.headlinesSize + templates[template].fontsAdjust);
    offsetY = renderBandsString(front, offsetY, globalSetup.frontSize + templates[template].fontsAdjust);
    offsetY = renderBandsString(support, offsetY, globalSetup.supportingSize + templates[template].fontsAdjust);
  });
}

let initSetup = function() {
  setup = setups[0];
  offsetY = globalSetup.initOffset;
  fillValuesFromSetup()
  setTemplate();
}

let getBandNamesFromString = function(bands) {
  return bands.split(",");
}

let maxPossibleBandsInLine = function(bands) {
  let maxPossibleBandsNumber = bands.length;
  while(ctx.measureText(bands.slice(0,maxPossibleBandsNumber).join(separator)).width > limit && maxPossibleBandsNumber > 1) {
    maxPossibleBandsNumber--;
  }
  return maxPossibleBandsNumber;
}

let renderBandNamesWithSize = function(bandNames, offY) {
  let bandNamesToRender = [...bandNames];
  while (bandNamesToRender.length > 0) {
    let numBands = maxPossibleBandsInLine(bandNamesToRender)
    let bandsInLine = bandNamesToRender.splice(0,numBands).join(separator)
    let metrics = ctx.measureText(bandsInLine);
    offY += 1.2*(metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent);
    if(templates[template].strokeWidth > 0) {
      ctx.strokeText(bandsInLine, canvasw/2,offY);
    }
    ctx.fillText(bandsInLine, canvasw/2,offY);
  }
  return offY;
}

let renderBandsString = function(bands, offY, size) {
  let bandNames = getBandNamesFromString(bands)
  ctx.font = adjustSize(size, bandNames)+"px "+templates[template].font;
  offY = renderBandNamesWithSize(bandNames,offY)
  return offY;
}

let renderTitle = function(title) {
  let fontsize = globalSetup.logoSize+templates[template].titleAdjust+templates[template].fontsAdjust;
  ctx.font = adjustSize(fontsize, [title])+"px "+templates[template].font;
  if(templates[template].strokeWidth > 0) {
    ctx.strokeText(title, canvasw/2, globalSetup.logoSize+globalSetup.titleOffset+templates[template].titleOffset);
  }
  ctx.fillText(title, canvasw/2, globalSetup.logoSize+globalSetup.titleOffset+templates[template].titleOffset);
}

let setEvents = function() {
  $("#template").change(applyTemplate);
  $("#head").on("input", renderCanvas);
  $("#front").on("input", renderCanvas);
  $("#support").on("input", renderCanvas);
  $("#festName").on("input", renderCanvas);
  $("#download").on("click", saveCanvas)
}

function base64ToArrayBuffer(_base64Str) {
  var binaryString = window.atob(_base64Str);
  var binaryLen = binaryString.length;
  var bytes = new Uint8Array(binaryLen);
  for (var i = 0; i < binaryLen; i++) {
    var ascii = binaryString.charCodeAt(i);
    bytes[i] = ascii;
  }
  return bytes;
}

function downloadURI(uri, name) {
  var link = document.createElement('a');
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function saveCanvas(e) {
  downloadURI($("#canvas")[0].toDataURL(), 'festival.png');
}

function waitForWebfonts(fonts, callback) {
  var loadedFonts = 0;
  for(var i = 0, l = fonts.length; i < l; ++i) {
    (function(font) {
      var node = document.createElement('span');
      // Characters that vary significantly among different fonts
      node.innerHTML = 'giItT1WQy@!-/#';
      // Visible - so we can measure it - but not on the screen
      node.style.position      = 'absolute';
      node.style.left          = '-10000px';
      node.style.top           = '-10000px';
      // Large font size makes even subtle changes obvious
      node.style.fontSize      = '300px';
      // Reset any font properties
      node.style.fontFamily    = 'sans-serif';
      node.style.fontVariant   = 'normal';
      node.style.fontStyle     = 'normal';
      node.style.fontWeight    = 'normal';
      node.style.letterSpacing = '0';
      document.body.appendChild(node);

      // Remember width with no applied web font
      var width = node.offsetWidth;

      node.style.fontFamily = font + ', sans-serif';

      var interval;
      function checkFont() {
        // Compare current width with original width
        if(node && node.offsetWidth !== width) {
          ++loadedFonts;
          node.parentNode.removeChild(node);
          node = null;
        }

        // If all fonts have been loaded
        if(loadedFonts >= fonts.length) {
          if(interval) {
            clearInterval(interval);
          }
          if(loadedFonts === fonts.length) {
            callback();
            return true;
          }
        }
      }

      if(!checkFont()) {
        interval = setInterval(checkFont, 50);
      }
    })(fonts[i]);
  }
}

$(function() {
  let fontsArray = ['Jost', 'Cinzel', 'Goblin One', 'Lobster', 'Zen Dots', 'Crimson Text', 'Metal Mania', 'Chicle'];
  let loaded = 0;
  waitForWebfonts(fontsArray, () => {
    loaded++;
    if(loaded == fontsArray.length) {
      initContext();
      initSetup();
      renderCanvas();
      setEvents();
    }
  })
});
