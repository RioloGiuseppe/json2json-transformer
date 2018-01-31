import { parseTemplate } from '../build/index'
import { expect } from 'chai';
import { readFileSync } from 'fs'

describe('Render plain object',  () => {
  it('should apply plain data to template', () => {
      let template =JSON.parse(readFileSync('test/template.plain.json', 'utf8'));
      let data =JSON.parse(readFileSync('test/data.plain.json', 'utf8'));
      let out = parseTemplate(data, template);
      expect(out.literalProperty).to.equal('Constant');
      expect(out.simpleProperty).to.equal('Hello');
      expect(out.composeProperty).to.equal('Hello world. Number: 20');
  });
});

describe('Render plain object with nested properties',  () => {
  it('should apply plain data with deep properties to template', () => {
      let template =JSON.parse(readFileSync('test/template.plain.deep.json', 'utf8'));
      let data1 =JSON.parse(readFileSync('test/data.plain.deep.json', 'utf8'));
      let out = parseTemplate(data1, template);
      expect(out.literalProperty).to.equal('Constant');
      expect(out.simpleProperty).to.equal('Hi');
      expect(out.composeProperty).to.equal('Hi planet. Number: 30');
  });
});

describe('Render complex object with nested properties',  () => {
  it('should apply plain two data sources with deep properties to single template', () => {
      let template =JSON.parse(readFileSync('test/template.nested.json', 'utf8'));
      let data1 =JSON.parse(readFileSync('test/data.plain.json', 'utf8'));
      let data2 =JSON.parse(readFileSync('test/data.plain.deep.json', 'utf8'));
      let partial = parseTemplate(data1, template);
      let out = parseTemplate(data2, partial);
      expect(out.literalProperties.literal1).to.equal('Constant');
      expect(out.literalProperties.literal2).to.equal('Constant');
      expect(out.simpleProperties.simple1).to.equal('Hello');
      expect(out.simpleProperties.simple2).to.equal('planet');
      expect(out.composePropeties.compose1).to.equal('Hi planet. Number: 30');
      expect(out.composePropeties.compose2).to.equal('Hello world. Number: 20');
  });
});