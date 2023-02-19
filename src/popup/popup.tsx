import React from 'react';
import { createRoot } from 'react-dom/client';
import './popup.css';

const test = <img src="icon.png" />;

const container = document.createElement('div');
document.body.appendChild(container);
const root = createRoot(container);
root.render(test);