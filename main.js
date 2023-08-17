grid = document.getElementsByClassName("grid-container")[0]
grid_items = document.getElementsByClassName("grid-item")
main_ul = grid_items[0].children[0]
secondary_ul = grid_items[1].children[0]
content_area = grid_items[2].children[0]
loc = [0, 0]
menu = [ 
    ["Overview", "Implementation details"], //"Paper"],
    ["Kepler's 3rd Law"],
    ["Closer Planets", "Further Planets"],
    ["Closer Planets", "Further Planets"],
    ["Closer Planets", "Further Planets"],
    ["Pluto", "Mercury", "Mars", "Saturn"],
    ["Spirograph"],
    ["Ptolemy Orbits"],
    ["General Relativity", "Binary Star"]
]
content_prefixes = [
    "_Welcome",
    "challenge1",
    "challenge2",
    "challenge3",
    "challenge4",
    "challenge5",
    "challenge6",
    "challenge7",
    "g_r",
]
content_urls = [
    ["_Overview.html", "Impl_details.html"], //"Paper.html"],
    ["challenge1.html"],
    [],
    ["plotly.html", "plotly.html"],
    ["", "challenge4.html"],
    [],
    [],
    ["challenge7.html"],
    ["relativity.html"],
]
content_funcs = [
    [],
    ["get_challenge_1_data"],
    ["get_challenge_2_closer_data", "get_challenge_2_further_data"],
    ["get_challenge_3_closer_data", "get_challenge_3_further_data"],
    ["get_challenge_4_closer_data", "get_challenge_4_further_data"],
    ["get_challenge_5_data_pluto", "get_challenge_5_data_mercury", 
        "get_challenge_5_data_mars", "get_challenge_5_data_saturn"],
    ["load_challenge_6"],
    ["load_challenge_7"],
    ["load_g_r", "load_binary_star"],
]


// stop warnings about looping scaleanchors
console.trace = () => {}

//challenge_6_blob_url = challenge_blob_urls[1]

function init_ul_with_func(ul, fname) {
    for(i=0; i<ul.children.length; i++){
    // TODO: make enter functions take ul as param
    // ^^^ adds flexibility
    func = eval("() => {"+fname+"("+i+")}")
    ul.children[i].addEventListener("click", func);
    ul.children[i].addEventListener("touchstart", func);
    ul.children[i].addEventListener("mousedown", func);
    }
}

function enter(id) {

    if (main_ul.children[id].classList.contains("active")) {
    return
    }
    loc[0] = id

    // select item on main menu
    for(j=0; j<main_ul.children.length; j++){
    main_ul.children[j].classList = []
    }
    main_ul.children[id].classList = ["active"]

    // change secondary menu
    secondary_ul.innerHTML=""
    for(i=0;i<menu[id].length;i++) {
    li = document.createElement("li")
    li.innerText = menu[id][i]
    secondary_ul.appendChild(li)
    }

    // TODO: conditionally append 'back' button

    // activate first item of secondary menu, if it exists
    if(secondary_ul.children.length) {

    // make first item explicitly non active firstly
    secondary_ul.children[0].classList = []

    // activate and load iframe
    secondary_enter(0)

    // make secondary menu interactive
    init_ul_with_func(secondary_ul, "secondary_enter")
    }
}

function secondary_enter(id) {

    if (secondary_ul.children[id].classList.contains("active")) {
    return
    }
    loc[1] = id

    // select item on secondary menu
    for(j=0; j<secondary_ul.children.length; j++){
    secondary_ul.children[j].classList = []
    }
    secondary_ul.children[id].classList = ["active"]

    // change content area
    show_content_page(loc, id)
}

function switch_view(is_big_to_small) {
    if(is_big_to_small) {
    grid.classList = ["grid-container-smallmenu"]
    grid.removeChild(grid.children[1])
    } else {
    nav = document.createElement("nav")
    nav.classList.add("grid-item", "noselect")
    nav.appendChild(secondary_ul)
    grid.classList = ["grid-container"]
    grid.insertBefore(nav, grid.children[1])
    }
}

function create_asset_url(loc, id) {
    //if (content_prefixes[loc[0]] == "challenge6") {
        // requires challenge 6 shim to have previously executed successfully
    //    return challenge_6_blob_url
    //}
    return "./menu_items/"+content_prefixes[loc[0]]+"/"+content_urls[loc[0]][id]
}

// do info shim
try {
    document.getElementById("challenge2_code0").textContent = `
// get the position from planet angle and index (referring to planet list)
function get_pos_indx_from_angle(theta, indx) {
    ae = get_new_ae(indx) // retrieve a, eccentricity for planet
    r = angleToRadius(theta, ae[1], ae[0]);

    // no beta correction: mapping all 2d orbits onto one 2d plane, NOT taking 2d slice of 3d space
    coords = polarToCartesian(r, theta, 0)
    // fix for swapping foci
    coords.x = coords.x - ae[1]*ae[0]*2;
    return coords
}`.trim();
    document.getElementById("challenge2_code1").textContent = document.getElementById("challenge2_code0").textContent
    document.getElementById("challenge4_code0").textContent = `
// find next points
for (i=0; i<data_i.length; i++) {
    
    // index of planet
    j = indexes[data_i[i]-1]

    // get coordinates (new_data_array[j][4] == planet beta)
    coord = get_pos_indx(animate_time, j)
    x = coord.x * Math.cos(new_data_array[j][4] * Math.PI / 180)
    z = coord.x * Math.sin(new_data_array[j][4] * Math.PI / 180)

    // update
    chart.series[data_i[i]].update({data:[[coord.y, z, x]]}, i === data_i.length-1)
    continue;

}`.trim();
    document.getElementById("challenge4_code1").textContent = document.getElementById("challenge4_code0").textContent

    hljs.highlightAll()
} catch {}

function show_content_page(loc, id) {

    try {
        o = document.body.style
        f = document.getElementById('helpmenu').style
        f.display = 'none'
        if(window['v']) o.overflow = window['v']

        els = document.getElementsByClassName("__hide")
        for(i=0;i<els.length;i++) els[i].style.display = "none"
        document.getElementById("help"+loc[0]+"_"+(loc[1]+1)).style.display = "block"
    } catch {}

    if(loc[0] > 0 && loc[0] < 7) {
        document.getElementById("help").style.display = "flex"
    } else {
        document.getElementById("help").style.display = "none"
    }
    

    try {
    // challenge4.js dependent
    challenge_4_overlay_toggle(false)
    challenge_4_timeout && clearInterval(challenge_4_timeout)

    // challenge3.js dependent
    animate_stop_flag = true
    animate_running_toggle = false

    // animation challenges
    // challenge 4 handles this independently
    if(loc[0] === 3) {// || loc[0] === 4) {
        show_animate_overlay()
    } else {
        hide_animate_overlay()
    }

    //animate_stop_counter = true
    //animate_3d_counter = true
    } catch {}

    if (content_funcs[loc[0]] && (asset_func = content_funcs[loc[0]][id])) {

    try {
        animate_instareset = true
        animate_time = 0
        document.getElementById("animate_playpause").style.borderColor = ""
        document.getElementById("animate_break").style.display = "none"
        document.getElementById("animate_years").textContent = "-- t = 0.0 years --"
    } catch {}

    content_area.innerHTML = "<div id=\"content_area\"></div>"
    data = eval(asset_func)()
    //console.log(data)
    if(data)
        plot = Plotly.newPlot('content_area', ...data);

    // else script handles it itself
    }
    else {

    url = create_asset_url(loc, id)
    //console.log(url)

    content_area.innerHTML = ""
    a = document.createElement("iframe")
    a.src = url
    a.classList = ["invisible"]
    // TODO add 'loading...'
    a.onload = () => {
        a.classList = []
    }
    content_area.appendChild(a)
    }
}

init_ul_with_func(main_ul, "enter")
init_ul_with_func(secondary_ul, "secondary_enter")

show_content_page(loc,0)