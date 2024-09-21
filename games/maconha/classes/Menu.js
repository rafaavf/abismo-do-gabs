class Menu {
    constructor(){
        var menuButtons = [
            'play',
            'ends',
            'controls'
        ]
    }

    menuButtons(playFunc){
        const playButton = document.createElement('button');
        playButton.className='menuButtons';
        playButton.textContent='Jogar';
        playButton.addEventListener('click', ()=>{
            state.gamestate='play';
        })

        const infoButton = document.createElement('button');
        infoButton.className='menuButtons';
        infoButton.textContent='Finais';
        infoButton.addEventListener('click', ()=>{
        })

        const statisticsButton = document.createElement('button');
        statisticsButton.className='menuButtons';
        statisticsButton.textContent='Estatísticas';
        statisticsButton.addEventListener('click', ()=>{

        })

        const content = document.getElementById('content');
        content.appendChild(playButton);
        content.appendChild(infoButton);
        content.appendChild(statisticsButton);
    }
}