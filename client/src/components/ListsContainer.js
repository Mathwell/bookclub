import React, { Component } from 'react';
import axios from 'axios';
import List from './List';
import NewListForm from './NewListForm';
import EditListForm from './EditListForm'

class ListsContainer extends Component {
    constructor(props){
        super(props)
        this.state = {
            lists: []
        }
        this.addNewList = this.addNewList.bind(this)
    }
    componentDidMount() {
        axios.get('/api/v1/lists')
        .then(response => {
            console.log(response)
            //debugger
            this.setState({
                lists: response.data
            })
        })
        .catch(error => console.log(error))
        
        fetch(`/api/v1/lists`)
        .then(response => response.json())
        .then(data=> console.log(data))
    }

    addNewList(title, excerpt) {
        axios.post( '/api/v1/lists', { list: {title, excerpt} })
        .then(response => {
            console.log(response)
            const lists = [ ...this.state.lists, response.data ]
            this.setState({lists})
        })
        .catch(error => {
            console.log(error)
        })
    }

    editList(id, title, excerpt) {
        axios.put( '/api/v1/lists/' + id, { 
            list: {
                title, 
                excerpt
            } 
        })
        .then(response => {
            console.log(response);
            const lists = this.state.lists;
            lists[id-1] = {id, title, excerpt}
            this.setState(() => ({
                lists, 
                editingListId: null
            }))
        })
        .catch(error => console.log(error));
    }
    
    render() {
        return (
            <div className="lists-container">
                {this.state.lists.map( list => {
                    if ( this.state.editingListId === list.id ) {
                        return (<EditListForm 
                                list={list} 
                                key={list.id} 
                                editList={this.editList} 
                                />)
                    } else {
                        return (<List 
                                list={list} 
                                key={list.id} 
                                onRemoveList={this.removeList} 
                                editingList={this.editingList} 
                                />)
                    }
                })}

                <NewListForm onNewList={this.addNewList} />
            </div>
        )
    }
}

export default ListsContainer;