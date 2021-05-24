(function() {
  // first we need to create a stage
  var stage = new Konva.Stage({
    container: "container", // id of container <div>
    width: parseInt(window.innerWidth),
    height: parseInt(window.innerHeight)
  });

  // then create layer
  var layer = new Konva.Layer();

  // List of documents
  var list = [
    "U.S. Constitution",
    "The First Amendment",
    "The Second Amendment",
    "The Third Amendment",
    "The Fourth Amendment",
    "The Fifth Amendment",
    "The Sixth Amendment",
    "The Seventh Amendment",
    "The Eighth Amendment",
    "The Ninth Amendment",
    "The Tenth Amendment",
    "Magna Carta",
    "Mayflower Compact",
    "English Bill of Rights",
    "Articles of Confederation",
    "The Fifteenth Amendment",
    "The Fourteenth Amendment",
    "The Thirteenth Amendment",
    "The Civil Rights Act (1964)",
    "The Twenty-Fourth Amendment",
    "The Stamp Act",
    "The Homestead Act",
    "The Intolerable Acts",
    "The Federalist Papers",
    "The Anti-Federalist Papers",
    "Monroe Doctrine",
    "The Declaration of Independence",
    "Common Sense By Thomas Paine",
    "The Northwest Ordinance",
    "The Treaty of Ghent",
    "The Treaty of Paris (1783)",
    "The Treaty of Paris (1763)",
    "The Emancipation Proclaimation",
    "The Gettysburg Address"
  ];

  list.forEach((x, i) => {
    var plormi = Math.random() < 0.5 ? -1 : 1,
      rect = new Konva.Group({
        x: Math.floor(Math.random() * (window.innerWidth - 85)),
        y: Math.floor(Math.random() * (window.innerHeight - 110)),
        width: 115,
        height: 140,
        draggable: true,
        rotation: Math.floor(Math.random() * 10) * plormi,
        name: i.toString()
      });

    rect.add(
      new Konva.Rect({
        fill: "white",
        stroke: "black",
        strokeWidth: 2,
        width: 115,
        height: 140,
        name: i.toString()
      })
    );


    rect.add(
      new Konva.Text({
        text: x,
        fontSize: 18,
        fontFamily: "Calibri",
        fill: "#000",
        width: 115,
        padding: 3,
        align: "center",
        name: i.toString()
      })
    );

    layer.add(rect);
  });

  layer.on("click", shapeClick);
  layer.on("tap", shapeClick);
  stage.add(layer);
  layer.draw();
  
  function shapeClick(evt) {
    var shape = evt.target;
    layer.find("." + shape.name()).forEach(x => {
      if (x.children.length) {
        answer(list[shape.name()]);
      } else {return;}
    });
  }
  

  var objectives = [
    {
      question: "Find the amendment that gave freed slaves the right to vote",
      answer: list[15]
    },
    {
      question: "Find the act that was signed by Dwight D. Eisenhower in 1964",
      answer: list[18]
    },
    {
      question: "Find the amendment that freed former slaves.",
      answer: list[17]
    },
    {
      question: "Find the amendment that granted citizenship to all slaves in the U.S.",
      answer: list[16]
    }
  ];

  var option = Math.floor(Math.random() * objectives.length);

  window.addEventListener("load", () => {
    if(!window.userId) {
      alert("An error has occurred!");
    } else {
      alert("Your Objective: " + objectives[option].question);
    }
  });

  function answer(response) {
    if (response == objectives[option]["answer"]) {
      socket.emit("win", window.userId);
      alert("Success!")
      document.querySelector("body").innerHTML = "Done! You should see your name on the leaderboard.";
    } else {
      alert("Try again..");
    }
  }
})();
