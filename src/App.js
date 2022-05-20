import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      author_name: '',
      quote_text: ''
    }
  }

  componentDidMount() {
    this.getPosts();
  }

  getPosts = () => {
    axios.get('http://localhost:3000/posts').then(res => this.setState({posts: res.data}));
  }

  handleChange = (author) => event => {
    console.log('author')
    this.setState({ [author]: event.target.value });
  }

  handleRemove = (id) => {
    if (!id) return;
    axios.delete(`http://localhost:3000/post/delete/${id}`).then(()=> this.getPosts());
  }

  handleSubmit = () => {
    axios.post('http://localhost:3000/add/post', {author_name: this.state.author_name, quote_text: this.state.quote_text})
      .then(this.setState({author_name: '', quote_text: ''}))
      .then(() => this.getPosts());
  }

  handleEdit = (item, id) => {
    console.log(item, "item")
    console.log(id)
    axios.put(`http://localhost:3000/edit/post/${id}`, {author_name: item.author_name, quote_text: item.quote_text})
      .then(() => this.getPosts())
  }

   render() {
    return (
      <div className="App">
        <form onSubmit={this.handleSubmit}>
          <div className="title">Add Post</div>
          <input placeholder="Author Name" type="text" value={this.state.author_name} onChange={this.handleChange('author_name')}/>
          <input placeholder="Quote Text" type="text" value={this.state.quote_text} onChange={this.handleChange('quote_text')}/>
          <div className="btn"  onClick={this.handleSubmit}>Add</div>
        </form>
        <div className="title">Post Table</div>
        <ul className="list">
          {
            this.state && this.state.posts ? this.state.posts.length > 0 ? this.state.posts.map((item, i) =>
            <Post key={i} user={item} remove={() => this.handleRemove(item['_id'])} edit={(data) => this.handleEdit(data, item['_id'])}/>
          ) : console.log(this.state.posts) : ''
          }
        </ul>
      </div>
    );
  }
}


class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: true,
      author_name: this.props.user.author_name,
      quote_text: this.props.user.quote_text,
    }
  }

  handleEdit = () => {
    this.setState({
      disabled: false
    })
  }

  handleChange1 = event => {
    this.setState({ ...this.state, author_name: event.target.value })
    console.log(this.state)
  }

  handleChange2 = event => {
    this.setState({ ...this.state, quote_text: event.target.value })
    console.log(this.state)
  }

  handleSubmit = () => {
    this.setState({
      disabled: true
    })
  }

  render(){
    const {disabled, author_name, quote_text} = this.state;
    return (
      <li className="item">
        <p>Author Name</p>
        <input value={author_name} disabled={disabled}  onChange={this.handleChange1} />
        <p>Quote Text</p>
        <textarea value={quote_text} disabled={disabled}  onChange={this.handleChange2} />
        {disabled ?
          <div className="btn-edit" onClick={this.handleEdit}>Edit</div>
          : <div className="btn-save" onClick={() => {
              this.props.edit(this.state)
              this.handleSubmit(true)
            }}>Save</div>}
        <div className="btn-remove" onClick={this.props.remove}>Delete</div>
      </li>
    )
  }
}


export default App;
