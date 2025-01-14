const bar1 = document.getElementById('bar')
const nav = document.getElementById('navbar')

if(bar1){
    bar1.addEventListener('click' ,() =>{
        nav.classList.add('active');
    })
}

