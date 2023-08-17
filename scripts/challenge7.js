load_challenge_7 = () => {
    content_area.innerHTML = "";
    ifr = document.createElement("iframe")
    ifr.src = challenge_blob_urls[15]
    //ifr.onload = () => {
    //    ifr.contentWindow.document.innerHTML = blob_data
    //}
    content_area.appendChild(ifr)
    return null
}