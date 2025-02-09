let speedFactor = 5;
let characters = [
    { x: 0, y: 250, gender: 'Man', color: 'blue', pose: 'running', salary: 500, speed: 1*speedFactor, expression: 'happy'  },
    { x: 0, y: 450, gender: 'Woman',color: 'pink', pose: 'crawling', salary: 300, speed: 300/500*speedFactor, expression: 'crying' },
    { x: 0, y: 650, gender: 'Non-binary, genderqueer, or gender non-conforming',color: 'gray', pose: 'walking', salary: 400, speed: 400/500*speedFactor, expression: 'sad' }
    
];
let laneHeight;
let time = 0;
let scaleSize = 2; // Global scale factor
let moveCharacters = true;

function preload(){
    /* read csv file */
     table = loadTable("data/cleaned_stackoverflow_data_edited.csv",
    "csv", "header");
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    textAlign(CENTER);

    // Create Degree dropdown
    degreeSelect = createSelect();
    degreeSelect.position(windowWidth - 423, 50);
    degreeSelect.style('width', '200px'); 

    degreeSelect.option('Primary/elementary school');
    degreeSelect.option('Secondary school (e.g. American high school, German Realschule or Gymnasium, etc.)');
    degreeSelect.option('Some college/university study without earning a degree');
    degreeSelect.option('Associate degree (A.A., A.S., etc.)');
    degreeSelect.option('Bachelor’s degree (B.A., B.S., B.Eng., etc.)');
    degreeSelect.option('Master’s degree (M.A., M.S., M.Eng., MBA, etc.)');
    degreeSelect.option('Other doctoral degree (Ph.D., Ed.D., etc.)');
    degreeSelect.option('Professional degree (JD, MD, etc.)');

    degreeSelect.selected('Primary/elementary school');
    degreeSelect.changed(restart);

    // Create Years of Experience dropdown
    expSelect = createSelect();
    expSelect.position(windowWidth - 180, 50);
    expSelect.style('width', '100px'); 


    expSelect.option('0 - 5 years');
    expSelect.option('6 - 10 years');
    expSelect.option('11 - 15 years');
    expSelect.option('15 - 20 years');
    expSelect.option('More than 20 years');

    expSelect.selected('0 - 5 years');
    expSelect.changed(restart);

    (windowWidth, windowHeight);

    // Create the "Show Modal" button
    let alertButton = createButton('Learn More');
    alertButton.position(windowWidth/2, 10);

    // Create modal elements (hidden initially)
    let modal = createDiv().id('modal');
    let modalContent = createDiv().id('modalContent');  // Content area of the modal
    let closeBtn = createButton('x Close x').id('closeBtn');  // Close button (using × character)

    // Append modal content and close button to the modal div
    modal.child(modalContent);
    modal.child(closeBtn);

    // Style modal using CSS
    modal.style('display', 'none');
    modal.style('position', 'fixed');
    modal.style('top', '0');
    modal.style('left', '0');
    modal.style('width', '100%');
    modal.style('height', '100%');
    modal.style('background-color', 'rgba(0, 0, 0, 0.7)');
    modal.style('z-index', '1');

    // Style modal content
    modalContent.style('background-color', '#fff');
    modalContent.style('margin', '5% auto');
    modalContent.style('padding', '20px');
    modalContent.style('width', '80%');
    modalContent.style('max-height', '80%');
    modalContent.style('overflow-y', 'auto');
    modalContent.style('position', 'relative');  // To allow positioning of the close button inside it

    // Style the close button
    closeBtn.style('color', '#aaa');
    closeBtn.style('font-size', '28px');
    closeBtn.style('font-weight', 'bold');
    closeBtn.style('cursor', 'pointer');
    closeBtn.style('position', 'absolute');
    closeBtn.style('top', '10px');
    closeBtn.style('right', '20px'); // Position the close button at the top-right corner of the modal
    closeBtn.style('background', 'transparent');
    closeBtn.style('border', 'none');
    closeBtn.style('padding', '5px');
    
    // When the "Show Modal" button is clicked, fetch file content and show the modal
    alertButton.mousePressed(() => {
        fetch('data/info.txt')  // Replace with your file's path
            .then(response => response.text())
            .then(data => {
                // Set the modal content with the fetched file data
                modalContent.html(`<p>${data}</p>`);

                // Show the modal
                modal.style('display', 'block');
            })
            .catch(error => {
                console.error('Error loading file:', error);
                alert('Failed to load file content.');
            });
    });

    // When the "Close" button is clicked, close the modal
    closeBtn.mousePressed(() => {
        modal.style('display', 'none');
    });


    // button to skip animations
    let button = createButton('Skip Animations');
    button.position((width/2 -40), height - 40);
    button.mousePressed(skip);
    
    restart();




}

function restart(){
    time = 0;
    moveCharacters = true;
    
    let selectedRange = expSelect.value();
    let selectedEdu = degreeSelect.value();
    let minExp, maxExp;

    switch (selectedRange) {
        case '0 - 5 years':
            minExp = 0;
            maxExp = 5;
            break;
        case '6 - 10 years':
            minExp = 6;
            maxExp = 10;
            break;
        case '11 - 15 years':
            minExp = 11;
            maxExp = 15;
            break;
        case '15 - 20 years':
            minExp = 15;
            maxExp = 20;
            break;
        case 'More than 20 years':
            minExp = 21;
            maxExp = Infinity;
            break;
    }

    let filteredRows = table.getRows().filter(row => {
        let workExp = row.getNum("WorkExp");
        let education = row.getString("EdLevel");
        return workExp >= minExp && workExp <= maxExp && education === selectedEdu;
    });

    let genderGroups = {
        "Man": [],
        "Woman": [],
        "Non-binary, genderqueer, or gender non-conforming": []
    };

    filteredRows.forEach(row => {
        let gender = row.getString("Gender");
        let salary = row.getNum("ConvertedCompYearly");
        if (genderGroups[gender] != undefined) {
            genderGroups[gender].push(salary);
        }
    });

    for (let gender in genderGroups) {
        let salaries = genderGroups[gender];
        let averageSalary = Math.round(salaries.reduce((sum, salary) => sum + salary, 0) / salaries.length/1000, 2);
        averageSalary = isNaN(averageSalary) ? 0 : averageSalary; // Ensure averageSalary is not NaN
        characters.forEach(char => {
            if (char.gender == gender) {
                char.salary = averageSalary;
            }
        });
        console.log(`Average salary for ${gender} (${selectedRange}, ${selectedEdu}): ${averageSalary}`);
    }
    // Calculate the maximum salary
    let maxSalary = Math.max(...characters.map(char => char.salary));

    // Set the speed based on the ratio of the salary to the maximum salary
    characters.forEach(char => {
        char.speed = char.salary / maxSalary * speedFactor;
    });

    // Sort characters by salary
    characters.sort((a, b) => b.salary - a.salary);

    // Assign actions based on salary rank
    characters[0].pose = 'running'; // Highest salary
    characters[0].expression = 'happy';
    characters[1].pose = 'walking'; // Middle salary
    characters[1].expression = 'sad';
    characters[2].pose = 'crawling'; // Lowest salary
    characters[2].expression = 'crying';
    

    characters.forEach(char => {
        char.progress = 0;
        char.x =0; 
        let yOffset = 0;
        drawProgressBar(char);
        drawPerson(char.x, char.y + yOffset, char.color, char.pose, `$${char.salary}K`, char.expression, time, moveCharacters);
    
  })
}
function skip() {
  moveCharacters = false;
  characters.forEach(char => {
    char.progress = char.speed/speedFactor;
    char.x =(width-47)*char.progress; 
    let yOffset = 0;
    drawProgressBar(char);
    drawPerson(char.x, char.y + yOffset, char.color, char.pose, `$${char.salary}K`, char.expression, time, moveCharacters);
  
  })
  

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    background(255);


    if (moveCharacters){
        time += 0.05;
    } else{
        
    }
    // Draw horizontal lines
    stroke(200);
    strokeWeight(2);
    let count = 0;
    for(let y = 200; y < height - 100 && count < 7; y += 100 ) {
        line(0, y, width, y);
        laneHeight = y;
        count += 1;
    }
     
    // Draw starting line
    let start = ["S", "T", "A", "R", "T"];
    textSize(20);
    start.forEach((letter, index) => {
        text(letter, 15, 250+ index*100);  // Adjust x position for each letter
    });
    line(30, 200, 30, laneHeight);

    // Draw finish line
    let finishX = width - 50;  // Finish line position
    line(finishX, 200, finishX, laneHeight);
    let finish = ["F", "I", "N", "I", "S", "H"];
    finish.forEach((letter, index) => {
        text(letter, finishX + 10, 250 + index * 100);  // Adjust x position for each letter
    });

    // Update and draw characters
characters.forEach(char => {
    
    // Calculate progress
    char.progress = (char.x / (width-50)) * 100;

    // Move characters
    if (char.progress < 100.0 && moveCharacters) char.x += char.speed;
    else {
        moveCharacters = false;
        char.x =char.x;
    } 
    
    // Add bobbing motion
    let yOffset = 0;
    if (moveCharacters){
        if (char.pose === 'running') {
        yOffset = sin(time * 10) * 6;
        } else if (char.pose === 'walking') {
            yOffset = sin(time * 5) * 4;
        } else if (char.pose === 'crawling') {
            yOffset = sin(time * 3) * 2;
        }
    }
    
    // Draw progress bar
    drawProgressBar(char);
    
    drawPerson(char.x, char.y + yOffset, char.color, char.pose, `$${char.salary}K`, char.expression, time, moveCharacters);
});
    
    // Draw title
    fill(0);
    noStroke();
    textSize(48);
    text('The Unfair Race', width/2, 100);
    
    textSize(24);
    text('How do years of experience and level of education relate to the gender pay gap in the technology field in the USA?', width/2, 140);
    

    // Draw legend
    textSize(24);
    fill('blue');
    text('Men', 100, 60);
    fill('pink');
    text('Women', 220, 60);
    fill('gray');
    text('Non-Binary', 380, 60);

    // Draw title for dropdown
    textSize(18);
    text("Level of Education", windowWidth - 348, 40);
    text("Years of Experience", windowWidth - 100, 40);

    // Draw explanation for data
    textSize(15);
    text("Note: Salaries are shown as annual averages in USD.", (width/2), height - 50);

}

function drawPerson(x, y, color, pose, salary, expression, time) {

push();
translate(x, y);
scale(scaleSize);

fill(color);
stroke(0);
strokeWeight(2);

// Draw graduation hat
drawGraduationHat(0, -50);

if (pose === 'running') {
    // Running pose with animated legs and arms
    let legSwing = sin(time * 10) * 30;
    let armSwing = sin(time * 10) * 40;
    
    // Body
    line(0, 0, 0, -40);
    // Arms
    line(0, -30, cos(time * 10) * 20, -20 + armSwing/2);
    line(0, -30, -cos(time * 10) * 20, -20 - armSwing/2);
    // Legs
    line(0, 0, sin(time * 10) * 20, 20 + legSwing/2);
    line(0, 0, -sin(time * 10) * 20, 20 - legSwing/2);
    
} else if (pose === 'walking') {
    // Walking pose with slower animation
    let legSwing = sin(time * 5) * 20;
    let armSwing = sin(time * 5) * 20;
    
    // Body
    line(0, 0, 0, -40);
    // Arms
    line(0, -30, cos(time * 5) * 16, -20 + armSwing/2);
    line(0, -30, -cos(time * 5) * 16, -20 - armSwing/2);
    // Legs
    line(0, 0, sin(time * 5) * 16, 20 + legSwing/2);
    line(0, 0, -sin(time * 5) * 16, 20 - legSwing/2);
    
} else if (pose === 'crawling') {
    // Crawling pose with subtle animation
    let crawlOffset = sin(time * 3) * 10;
    let armSwing = sin(time * 5);

    
    // Body
    line(0, 0, 0, -40);
    line(0, 0, -30+ crawlOffset, 0);
    //Arms
    line(0, -30, cos(time * 5) * 16, -20 + armSwing/2);
    line(0, -30, -cos(time * 5) * 16, -20 - armSwing/2);
    // Limbs
    line(-30 + crawlOffset, 10, -30 + crawlOffset, 0);
    line(-10 + crawlOffset, 10, -10 + crawlOffset, 0);
    line(-40 + crawlOffset, 10, -30 + crawlOffset, 10);
    line(-20 + crawlOffset, 10, -10 + crawlOffset, 10);
}

// Draw head and expression
fill(color);
ellipse(0, -40, 40, 40);


// Draw facial expression
stroke(0);
strokeWeight(2);
if (expression === 'happy') {
    // Smile
    noFill();
    arc(0, -40, 20, 20, 0, PI);
    // Happy eyes
    line(-10, -46, -6, -46);
    line(6, -46, 10, -46);
} else if (expression === 'sad') {
    // Sad mouth
    noFill();
    arc(0, -30, 20, 20, PI, TWO_PI);
    // Sad eyes
    line(-10, -46, -6, -42);
    line(6, -46, 10, -42);
} else if (expression === 'crying') {
    // Crying mouth
    noFill();
    arc(0, -30, 20, 20, PI, TWO_PI);
    // Crying eyes with tears
    fill('lightblue');
    line(-6, -46, -10, -42);
    line(6, -46, 10, -42);
    ellipse(-8, -30 + sin(time * 5) * 4, 6, 10);
    ellipse(8, -30 + sin(time * 5 + PI) * 4, 6, 10);
}

function drawGraduationHat(x, y) {
    education = degreeSelect.selected();
    if (education != "Primary/elementary school" && education != "Some college/university study without earning a degree") {
        fill('black');
        stroke(0);x 
        strokeWeight(2);
        
        // Draw the top of the hat
        rect(x - 20, y - 10, 40, 10);

        // Draw the base of the hat
        triangle(x - 30, y - 10, x + 30, y - 10, x, y - 30);

        fill("white");
        textSize(15);
        if (education == "Secondary school (e.g. American high school, German Realschule or Gymnasium, etc.)") text("H", x, y-15);
        else if (education == "Associate degree (A.A., A.S., etc.)") text("A", x, y-15);
        else if(education == "Bachelor’s degree (B.A., B.S., B.Eng., etc.)") text("B", x, y-15);
        else if (education == "Master’s degree (M.A., M.S., M.Eng., MBA, etc.)") text("M", x, y-15);
        else text("D", x, y-15);
        
    } 
    
}


// Salary text
fill(0);
noStroke();
textSize(20);
text(salary, 0, 60);

pop();

}

function drawProgressBar(char) {
    const barWidth = width-80;
    const barHeight = 100;
    const x = 30;
    const y = char.y-50;
    
    // Draw background
    fill(200);
    noStroke();
    rect(x, y, barWidth, barHeight);
    
    // Draw progress
    fill(char.color);
    rect(x, y, (char.progress/100) * barWidth, barHeight);
    
    // Draw text
    // fill(0);
    // textSize(16);
    // text(`${char.progress.toFixed(1)}%`, x + barWidth + 30, y + 15);
    
    // Draw speedometer
    const speed = (char.speed/5) * 100;
    text(`Speed: ${speed.toFixed(1)}%`, x + 100, y -20);
}