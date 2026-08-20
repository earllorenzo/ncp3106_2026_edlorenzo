const observer = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){
            entry.target.classList.add("active");
        }else{
            entry.target.classList.remove("active");
        }

    });

},{
    threshold:0.5
});

document.querySelectorAll(".fill-text").forEach(el=>{
    observer.observe(el);
});

const photo = document.querySelector(".about-photo");

const photoObserver = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){
            photo.classList.add("show");
        }else{
            photo.classList.remove("show");
        }

    });

},{
    threshold:0.4
});

photoObserver.observe(document.querySelector("#about"));

const projectCards = document.querySelectorAll(".project");
const projectVideo = document.getElementById("projectVideo");
const projectImage = document.getElementById("projectImage");
//=====================
// Project Images
//=====================

const projectPhotos = {

"Smart Classroom Prototype":[
    "assets/classroom1.jpg",
    "assets/classroom2.jpg",
    "assets/classroom3.jpg"
],

"Fire Fighting Robot":[
    "assets/car1.jpg",
    "assets/car2.jpg",
    "assets/car3.jpg"
],
"Hunger Heroes - Game Development":[
    "assets/hr1.jpg",
    "assets/hr2.jpg",
    "assets/hr3.jpg"
],

};

let slideshow;
let currentIndex = 0;

function startSlideshow(projectName){

    // Hide the default video
    projectVideo.style.display = "none";

    // Show the slideshow image
    projectImage.style.display = "block";

    clearInterval(slideshow);

    const images = projectPhotos[projectName];

    currentIndex = 0;

    projectImage.src = images[0];

    projectImage.classList.add("show");

    slideshow = setInterval(()=>{

        projectImage.classList.remove("show");

        setTimeout(()=>{

            currentIndex++;

            if(currentIndex >= images.length){
                currentIndex = 0;
            }

            projectImage.src = images[currentIndex];

            projectImage.classList.add("show");

        },350);

    },2000);

}

projectCards.forEach(card=>{

    card.addEventListener("click",()=>{

        projectCards.forEach(c=>c.classList.remove("active"));
        card.classList.add("active");

const projectName = card.querySelector("h3").textContent;

// Reset image classes
projectImage.className = "project-photo show";

// Apply the correct image style
if(card.classList.contains("game")){
    projectImage.classList.add("game");
}
else if(card.classList.contains("robot")){
    projectImage.classList.add("robot");
}
else{
    projectImage.classList.add("classroom");
}

startSlideshow(projectName);

    });

});

const projectsSection = document.getElementById("projects");

const projectsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {

            // Stop any slideshow
            clearInterval(slideshow);

            // Show video again
            projectImage.style.display = "none";
            projectVideo.style.display = "block";
            projectVideo.currentTime = 0;
            projectVideo.play();
        }
    });
}, {
    threshold: 0.5
});

projectsObserver.observe(projectsSection);
