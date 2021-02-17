import React from 'react';
import request from 'superagent';
import './Search.css';
import Header from './Header.js';
import PokeList from './Pokemon/PokeList.js';
import Searchbar from './Searchbar.js';
import Spinner from './Spinner.js';
import Sort from './Sort.js';

export default class Search extends React.Component {
    state = {
        pokemons: [],
        query: '',
        sortOrder: 'asc',
        sortBy: 'pokemon',
        loading: false,
        
    }

    handleInputChange = async (e) => {
        this.setState({
            query: e.target.value,
        });
    }

    handleClick = async () => {

        await this.fetchPokemon();
    }

    handleChange = async (e) => {
        await this.setState({
           sortBy: e.target.value, 
        });

    }

    handleOrderChange = async (e) => {
        await this.setState({
           sortOrder: e.target.value, 
        });
    }

    componentDidMount = async () => {
        await this.fetchPokemon();
    }

    fetchPokemon = async () => {
        this.setState({ loading: true });

        const data = await request.get(`https://pokedex-alchemy.herokuapp.com/api/pokedex?${this.state.sortBy}=${this.state.query}&sort=${this.state.sortBy}&direction=${this.state.sortOrder}`);

        this.setState({
            pokemons: data.body.results,
            loading: false,
        });
    }
    
    render() {

        const filteredPokes = this.state.pokemons.filter(pokemon => pokemon.pokemon.includes(this.state.query))

        return (
        <div className="search">
            <Header />

            <main className="searchMain">

                <div className="sidebar">
                    <Searchbar 
                    handleChange={this.handleInputChange}
                    />
                    
                    <Sort
                    handleChange={this.handleChange}
                    pokeOptions={[
                        {name: 'name', value: 'pokemon'},
                        {name: 'type', value: 'type_1'},
                        {name: 'ability', value: 'ability_1'},
                        {name: 'shape', value: 'shape'},
                        {name: 'egg', value: 'egg_group_1'}
                    ]}/>

                    <Sort
                    handleChange={this.handleOrderChange}
                    pokeOptions={[
                        {name: 'ascending', value: 'asc'},
                        {name: 'descending', value: 'desc'}
                        ]}/>

                    <button onClick={this.handleClick}>go!</button>

                </div>

                <div className="pokeDisplay">
                    {
                    this.state.loading
                    ? <Spinner />
                    : <PokeList filteredPokes={filteredPokes} />
                    }
                </div>

                <div className="buttonWrapper">
                    <button className="previous">p</button>
                    <h6>page</h6>
                    <button className="next">n</button>
                </div>

            </main>
        </div>
        );
    }
}
