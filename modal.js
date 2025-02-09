document.addEventListener('DOMContentLoaded', (event) => {
    // Get the modal
    var modal = document.getElementById("modal");

    // Get the button that opens the modal
    var openBtn = document.getElementById("info");

    // Get the <span> element that closes the modal
    var closeBtn = document.getElementById("close");

    // When the user clicks the button, open the modal
    openBtn.addEventListener('click', () => {
        modal.classList.add('open');
    });

    // When the user clicks on <span> (x), close the modal
    closeBtn.addEventListener('click', () => { 
        modal.classList.remove('open');
    });

    // When the user clicks anywhere outside of the modal, close it
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.classList.remove('open');
        }
    });
});