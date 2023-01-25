const socket = io();

// // Element 
const $messageForm = document.querySelector("#message-form");
const $mmessageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-message-template').innerHTML;


socket.on("message", (message) => {
    const html = Mustache.render(messageTemplate, {
        message
    });
    $messages.insertAdjacentHTML('beforeend', html)
    console.log(message);
});

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    $messageFormButton.setAttribute('disabled', 'disabled');
    // Disable

    const message = e.target.elements.message.value;

    socket.emit("sendMessage", message, (error) => {
        $messageFormButton.removeAttribute('disabled');
        // Enable

        $mmessageFormInput.value = '';
        $mmessageFormInput.focus();

        if (error) {
            return console.log(error)
        }

        console.log('Message delivered!')
    });
})

socket.on('locationMessage', (url) => {
    const html = Mustache.render(locationTemplate, {
        url
    });
    $messages.insertAdjacentHTML('beforeend', html)
    console.log(url);
});

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled');
    // Disable

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled');
            // Enable
            console.log("Location shared!");
        })
    })
})