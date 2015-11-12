var React = require('react')
var ReactDOM = require('react-dom')
var request = require('http-as-promised')
var marked = require('marked')

var MessageBox = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  loadMessagesFromServer: function() {
    request({
      url: this.props.url,
      json: true
    })
    .then(function(data) {
      this.setState({data: data});
    })
    .catch(function(xhr, status, err) {
      console.error(this.props.url, status, err.toString());
    });
  },
  componentDidMount: function() {
    this.loadMessagesFromServer();
    setInterval(this.loadMessagesFromServer, this.props.pollInterval);
  },
  handleMessageSubmit: function(message) {
    var messages = this.state.data;
    var newMessage = messages.concat([message]);
    this.setState({data: newMessage});

    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: message,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="messageBox">
        <h1>Messages</h1>
        <MessageList data={this.state.data} />
        <MessageForm onMessageSubmit={this.handleMessageSubmit} />
      </div>
    );
  }
});

var MessageList = React.createClass({
  render: function() {
    var messageNodes = this.props.data.map(function (message) {
      return (
        <Message author={message.author}>
          {message.text}
        </Message>
      );
    });
    return (
      <div className="messageList">
        { messageNodes }
      </div>
    );
  }
});

var MessageForm = React.createClass({
  url: "/api/texts",

  onFormChange: function(key, e) {

  },

  handleSubmit: function(e) {
    e.preventDefault();

    var author = this.refs.author.value.trim();
    var text = this.refs.text.value.trim();
    if (!text || !author) {
      return;
    }

    this.props.onMessageSubmit({author: author, text: text, url: this.url});
    this.refs.author.value = '';
    this.refs.text.value = '';
    return;
  },

  render: function() {
    return (
      <form className="messageForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref="author" />
        <input type="text" placeholder="Say something..." ref="text" />
        <MessageType onChange={this.handleTypeChange}/>
        <input type="submit" value="Send" />
      </form>
    );
  }
});

var MessageType = React.createClass({
  props: { onChange: React.PropTypes.func.isRequired },

  handleTypeChange: function(e) {
    this.props.onChange(e.target.value)
  },

  render: function() {
    return (
      <div className="messageType">
        <select ref="messageType" onChange={this.handleTypeChange}>Types
          <option value="text">Text</option>
          <option value="email">Email</option>
        </select>
      </div>
    );
  }
});


var Message = React.createClass({
  rawMarkup: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return { __html: rawMarkup };
  },
  render: function() {
    return (
      <div className="message">
        <h2 className="messageAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    );
  }
});

ReactDOM.render(
  <MessageBox url="/api/comments" pollInterval={2000} />,
  document.getElementById('content')
);
