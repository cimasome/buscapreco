document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide-box');
    const totalSlides = slides.length;
    let currentSlide = 0;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    function showSlide(index) {
        const sliderContent = document.querySelector('.slider-content');
        const newMarginLeft = -(index * 100) + '%';
        sliderContent.style.marginLeft = newMarginLeft;
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }

    function previousSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }

    function touchStart(event) {
        startX = event.touches[0].clientX;
        isDragging = true;
    }

    function touchMove(event) {
        if (!isDragging) return;
        currentX = event.touches[0].clientX;
    }

    function touchEnd() {
        if (!isDragging) return;
        isDragging = false;

        const diffX = startX - currentX;
        if (diffX > 50) {
            nextSlide();
        } else if (diffX < -50) {
            previousSlide();
        }
    }

    const sliderContent = document.querySelector('.slider-content');
    sliderContent.addEventListener('touchstart', touchStart);
    sliderContent.addEventListener('touchmove', touchMove);
    sliderContent.addEventListener('touchend', touchEnd);

    setInterval(nextSlide, 3000); // Change slide every 3 seconds
});
