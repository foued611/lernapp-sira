// Startpunkt der App: bindet die Konfiguration an die gemeinsame Shell.
import { mountApp } from '../../core/js/shell.js';
import config from './config.js';

mountApp(config, { header: document.getElementById('hdr'), main: document.getElementById('app') });
