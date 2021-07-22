import React from 'react'
import ReactDOM from 'react-dom'

import { css, Global } from '@emotion/react'
import styled from '@emotion/styled'

const globalStyle = css`
  .container {
    max-width: 960px;
    margin: 0 auto;
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
