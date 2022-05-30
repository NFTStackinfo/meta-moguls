import './style/app.scss'

const App = () => {
  return (
    <div className="app">
        <div className="container">
            <div className="wrapper">
                <div className="logo">
                    <img src="logo.png" alt="Meta Moguls logo"/>
                </div>
                <div className="logo-text">
                    <img src="logo-text.svg" alt="Meta Moguls"/>
                </div>

                {/*register*/}
                {/*<div className="content">*/}
                {/*    <h1 className='title'>RAFFLE REGISTRATION</h1>*/}
                {/*    <p className='text main-text'>The registration is free and registering is only a metamask wallet. registration period ends in 11 hours 56 minutes 48 seconds.</p>*/}
                {/*    <p className='text info'>You need to have 0.25 ETH+gas fee to participate on Raffle.</p>*/}
                {/*    <div className='button-wrapper'>*/}
                {/*        <button className='button'>Register</button>*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/*success*/}
                {/*<div className="content">*/}
                {/*    <h1 className='title'>REGISTERED SUCCESSFULLY</h1>*/}
                {/*    <p className='text main-text'>check back tomorrow to see if you were selected to mint</p>*/}
                {/*</div>*/}

                {/*connect*/}
                {/*<div className="content content-sm">*/}
                {/*    <div className='grid'>*/}
                {/*        <button className='glow-block button-big grid-item'><img src="assets/1.png" alt="1"/></button>*/}
                {/*        <button className='glow-block button-big grid-item'><img src="assets/2.png" alt="2"/></button>*/}
                {/*        <button className='glow-block button-big grid-item'><img src="assets/3.png" alt="3"/></button>*/}
                {/*    </div>*/}
                {/*    <div className='row glow-block'>*/}
                {/*        <div>custom</div>*/}
                {/*        <div className='counter'>*/}
                {/*            <button><img src="assets/minus.svg" alt=""/></button>*/}
                {/*            <span>0</span>*/}
                {/*            <button><img src="assets/plus.svg" alt=""/></button>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*    <div className='row glow-block'>*/}
                {/*        <div>TOTAL</div>*/}
                {/*        <div>*/}
                {/*            2 NFT = 5 ETH*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*        <div className='button-wrapper'>*/}
                {/*            <button className='button'>connect</button>*/}
                {/*        </div>*/}
                {/*    <p className='small-text'>wallet address - 1234</p>*/}
                {/*</div>*/}

                {/*connect failed*/}
                {/*<div className="content">*/}
                {/*    <p className='text uppercase'>You have not been selected for the mint.</p>*/}
                {/*</div>*/}

                {/*connect*/}
                <div className="content">
                    <p className='small-text main-text uppercase'>Congrats! You have been selected for the Raffle.</p>
                    <div className="content-sm">
                        <div className='grid'>
                            <button className='glow-block button-big grid-item'><img src="assets/1.png" alt="1"/></button>
                            <button className='glow-block button-big grid-item'><img src="assets/2.png" alt="2"/></button>
                            <button className='glow-block button-big grid-item'><img src="assets/3.png" alt="3"/></button>
                        </div>
                        <div className='row glow-block'>
                            <div>custom</div>
                            <div className='counter'>
                                <button><img src="assets/minus.svg" alt=""/></button>
                                <span>0</span>
                                <button><img src="assets/plus.svg" alt=""/></button>
                            </div>
                        </div>
                        <div className='row glow-block'>
                            <div>TOTAL</div>
                            <div>
                                2 NFT = 5 ETH
                            </div>
                        </div>
                        <div className='button-wrapper'>
                            <button className='button'>mint now</button>
                        </div>
                        <p className='small-text'>wallet address - 1234</p>
                    </div>


                </div>
            </div>
        </div>
    </div>
  );
}

export default App;
