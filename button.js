document.addEventListener('DOMContentLoaded', function() {
    const burgerIcon = document.querySelector('.burger'); 
    const closeIcon = document.querySelector('.close'); 
    const subnav = document.querySelector('.subnav');
    const burgerCheckbox = document.getElementById('burger');

    burgerIcon.addEventListener('click', function() {
        subnav.classList.add('active');
        burgerIcon.style.display = 'none';
        closeIcon.style.display = 'block';
    });

    closeIcon.addEventListener('click', function() {
        subnav.classList.remove('active');
        burgerIcon.style.display = 'block';
        closeIcon.style.display = 'none';
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth >= 700) {
            subnav.classList.remove('active');
            burgerIcon.style.display = 'none';
            closeIcon.style.display = 'none';
            burgerCheckbox.checked = false;
        } else {
            burgerIcon.style.display = 'block';
        }
    });

    if (window.innerWidth >= 700) {
        burgerIcon.style.display = 'none';
        closeIcon.style.display = 'none';
        burgerCheckbox.checked = false;
    } else {
        burgerIcon.style.display = 'block';
    }
});
