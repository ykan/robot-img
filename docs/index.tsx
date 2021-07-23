import React from 'react'
import ReactDOM from 'react-dom'

import { css, Global } from '@emotion/react'
import styled from '@emotion/styled'

const globalStyle = css`
  body {
    margin: 0;
  }
  .container {
    max-width: 960px;
    margin: 0 auto;
  }
  .markdown-body {
    margin-top: 30px;
  }

  .example-container {
    display: flex;
    border-radius: 4px;
    overflow: hidden;
    margin-top: 20px;
    margin-bottom: 30px;
    box-shadow: 0 0 12px 0 rgba(102, 102, 102, 0.12);
    .example {
      flex: 1;
      padding: 10px;
      max-height: 500px;
    }
    .code {
      flex: 2;
      max-height: 500px;
      overflow: scroll;

      pre {
        margin: 0;
      }
    }
  }
`

const Nav = styled.div`
  box-shadow: 0 0 12px 0 rgba(102, 102, 102, 0.12);
  &:hover {
    box-shadow: 0 0 12px 0 rgba(102, 102, 102, 0.2);
  }

  .container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .menu-item {
    margin-left: 20px;
    text-decoration: none;
    color: #333;
  }
`

ReactDOM.render(
  <React.StrictMode>
    <Global styles={globalStyle} />
    <Nav>
      <div className="container">
        <h1>Robot Img</h1>
        <div className="menu">
          <a href="#docs" className="menu-item">
            文档
          </a>
          <a href="#api" className="menu-item">
            API
          </a>
          <a href="https://github.com/ykan/robot-img" className="menu-item">
            Github
          </a>
        </div>
      </div>
    </Nav>
  </React.StrictMode>,
  document.getElementById('nav')
)
