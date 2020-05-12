import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';

type Props = {
  children: ReactNode;
};

export default class Portal extends React.Component<Props> {
  node = document.getElementById('modal');

  el = document.createElement('div');

  componentDidMount() {
    if (this.node) {
      this.node.appendChild(this.el);
    }
  }

  componentWillUnmount() {
    if (this.node) {
      this.node.removeChild(this.el);
    }
  }

  render() {
    const { children } = this.props;
    return ReactDOM.createPortal(children, this.el);
  }
}
