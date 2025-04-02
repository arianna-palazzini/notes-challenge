import React from 'react';
import { createComponent } from '@lit/react';
import { NoteElement } from './Note';

export const NoteCard = createComponent({
  tagName: 'note-card',
  elementClass: NoteElement, 
  react: React,
});

