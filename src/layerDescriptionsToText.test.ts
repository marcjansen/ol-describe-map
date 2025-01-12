import Source from 'ol/source/Source';
import {
  layerDescriptionsToText
} from './layerDescriptionsToText';
import { LayerDescription, WMSLayerDetails } from './types';
import { determineLayerType } from './determineLayerType';
import { determineSourceType } from './determineSourceType';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import TileWMS from 'ol/source/TileWMS';


let tileLayerBasicDesc: LayerDescription = {
  details: null,
  type: determineLayerType(new TileLayer()),
  source: determineSourceType(new Source({}))
};

let vectorLayerBasicDesc: LayerDescription = {
  details: null,
  type: determineLayerType(new VectorLayer()),
  source: determineSourceType(new VectorSource({}))
};

let vectorLayerDesc: LayerDescription = {
  details: {
    numFeaturesInExtent: 4,
    numRenderedFeaturesInExtent: 1,
    numSkippedFeaturesInExtent: 3,
    numTotalFeaturesInSource: 8,
    renderedStatistics: {
      propFoo: {
        min: 1,
        minName: 'Luffy',
        max: 1,
        maxName: 'Luffy',
        avg: 1,
        sum: 1
      }
    }
  },
  type: determineLayerType(new VectorLayer()),
  source: determineSourceType(new VectorSource({}))
};

let vectorLayerDescMoreFeatures: LayerDescription = {
  details: {
    numFeaturesInExtent: 4,
    numRenderedFeaturesInExtent: 3,
    numSkippedFeaturesInExtent: 1,
    numTotalFeaturesInSource: 8,
    renderedStatistics: {
      someProp: {
        min: 1,
        minName: 'min value',
        max: 3,
        maxName: 'MAX VALUE',
        avg: 2,
        sum: 6
      },
      anotherOne: {
        min: -10,
        minName: 'min',
        max: 10,
        maxName: 'MAX',
        avg: 0,
        sum: 0
      }
    }
  },
  type: determineLayerType(new VectorLayer()),
  source: determineSourceType(new VectorSource({}))
};

let vectorLayerFeaturesWithoutNames: LayerDescription = {
  details: {
    numFeaturesInExtent: 2,
    numRenderedFeaturesInExtent: 2,
    numSkippedFeaturesInExtent: 2,
    numTotalFeaturesInSource: 2,
    renderedStatistics: {
      scribble: {
        min: 1,
        max: 1,
        avg: 1,
        sum: 1
      }
    }
  },
  type: determineLayerType(new VectorLayer()),
  source: determineSourceType(new VectorSource({}))
};

let singleWmsLayerDesc: LayerDescription = {
  details: {
    serviceAbstract: 'Foo Abstract',
    serviceKeywords: [ 'Service keyword 1', 'Service keyword 2' ],
    serviceTitle: 'Foo',
    topLevelLayerAbstract: 'The abstract of layer-number-1',
    topLevelLayerTitle: 'The title of layer-number-1',
    wmsLayerNames: [ 'a' ],
    wmsLayerAbstracts: [ 'The abstract of a' ],
    wmsLayerTitles: [ 'Title of a' ],
    wmsLayerMetadataURLs: [
      'http://www.example.com/metadata/a.xml'
    ]
  },
  type: determineLayerType(new TileLayer()),
  source: determineSourceType(new TileWMS({params:{}}))
};

let multiWmsLayerDesc: LayerDescription = {
  details: {
    serviceAbstract: 'Foo Abstract',
    serviceKeywords: [ 'Service keyword 1', 'Service keyword 2' ],
    serviceTitle: 'Foo',
    topLevelLayerAbstract: 'The abstract of layer-number-1',
    topLevelLayerTitle: 'The title of layer-number-1',
    wmsLayerNames: [ 'a', 'b' ],
    wmsLayerAbstracts: [ 'The abstract of a', 'The abstract of b' ],
    wmsLayerTitles: [ 'Title of a', 'Title of b' ],
    wmsLayerMetadataURLs: [
      'http://www.example.com/metadata/a.xml',
      'http://www.example.com/metadata/b.xml'
    ]
  },
  type: determineLayerType(new TileLayer()),
  source: determineSourceType(new TileWMS({params:{}}))
};

describe('layerDescriptionsToText', () => {
  test('describes a very basic tile layer', () => {
    let descriptions: LayerDescription[] = [
      tileLayerBasicDesc
    ];
    let got: string[] = layerDescriptionsToText(descriptions);
    expect(got.length).toBeGreaterThanOrEqual(1);
    let text = got.join('');
    expect(text).toMatch(/1 layer./);
    expect(text).toMatch(/tile-layer/);
    expect(text).toMatch(/unknown-source/);
  });

  test('describes a very basic vector layer without details', () => {
    let descriptions: LayerDescription[] = [
      vectorLayerBasicDesc
    ];
    let got: string[] = layerDescriptionsToText(descriptions);
    expect(got.length).toBeGreaterThanOrEqual(1);
    let text = got.join('');
    expect(text).toMatch(/1 layer./);
    expect(text).toMatch(/vector-layer/);
    expect(text).toMatch(/Vector-source/);
  });

  test('describes details for vector layers', () => {
    let descriptions: LayerDescription[] = [
      vectorLayerDesc
    ];
    let got: string[] = layerDescriptionsToText(descriptions);
    expect(got.length).toBeGreaterThanOrEqual(1);
    let text = got.join('');
    expect(text).toMatch(/1 layer./);
    expect(text).toMatch(/vector-layer/);
    expect(text).toMatch(/Vector-source/);
    expect(text).toMatch(/contains 8 features/);
    expect(text).toMatch(/4 \(50%\) intersect/);
    expect(text).toMatch(/rendered was 1 \(25%\) feature/);
    expect(text).toMatch(/basic statistical information/);
    expect(text).toMatch(/propFoo/);
    expect(text).toMatch(/the value is 1/);
    expect(text).toMatch(/named 'Luffy'/);
  });

  test('describes details for vector layers (part 2)', () => {
    let descriptions: LayerDescription[] = [
      vectorLayerDesc, vectorLayerDescMoreFeatures
    ];
    let got: string[] = layerDescriptionsToText(descriptions);
    expect(got.length).toBeGreaterThanOrEqual(1);
    let text = got.join('');
    expect(text).toMatch(/2 layers./);
    expect(text).toMatch(/first/);
    expect(text).toMatch(/second/);
    expect(text).toMatch(/'someProp', 'anotherOne'/);
    expect(text).toMatch(/minimal value is 1 \(feature named 'min value'\)/);
    expect(text).toMatch(/maximum value is 3 \(for the feature with name 'MAX VALUE'\)/);
    expect(text).toMatch(/average value is 2 and the sum is 6/);
    expect(text).toMatch(/minimal value is -10 \(feature named 'min'\)/);
    expect(text).toMatch(/maximum value is 10 \(for the feature with name 'MAX'\)/);
    expect(text).toMatch(/average value is 0 and the sum is 0/);
  });

  test('describes details for vector layers, even when unnamed', () => {
    let descriptions: LayerDescription[] = [
      vectorLayerFeaturesWithoutNames
    ];
    let got: string[] = layerDescriptionsToText(descriptions);
    expect(got.length).toBeGreaterThanOrEqual(1);
    let text = got.join('');
    expect(text).toMatch(/1 layer./);
    expect(text).toMatch(/'scribble'/);
    expect(text).not.toMatch(/(named|with name)/);
  });
  test('describes details for single wms layer', () => {
    let descriptions: LayerDescription[] = [
      singleWmsLayerDesc
    ];
    let got: string[] = layerDescriptionsToText(descriptions);

    let text = got.join('');
    expect(text).not.toMatch(/composition/);
    expect(text).toMatch(/"a" \(/);
    expect(text).toMatch(/title: "Title of a"/);
    expect(text).toMatch(/abstract: "The abstract of a"/);
  });
  test('describes details for multi wms layer', () => {
    let descriptions: LayerDescription[] = [
      multiWmsLayerDesc
    ];
    let got: string[] = layerDescriptionsToText(descriptions);
    let text = got.join('');

    expect(text).toMatch(/composition of 2/);
    expect(text).toMatch(/"a" \(/);
    expect(text).toMatch(/title: "Title of a"/);
    expect(text).toMatch(/abstract: "The abstract of a"/);
    expect(text).toMatch(/"b" \(/);
    expect(text).toMatch(/title: "Title of b"/);
    expect(text).toMatch(/abstract: "The abstract of b"/);
  });
  test('describes details for wms layers, but without redundancy 1', () => {
    // adjust singleWmsLayerDesc, so that infos are less perfect
    let clonedDesc = Object.assign({}, singleWmsLayerDesc) as LayerDescription;
    (clonedDesc.details as WMSLayerDetails).wmsLayerAbstracts = ['a']; // same as name
    (clonedDesc.details as WMSLayerDetails).wmsLayerTitles = ['a']; // same as name

    let descriptions: LayerDescription[] = [
      clonedDesc
    ];
    let got: string[] = layerDescriptionsToText(descriptions);
    let text = got.join('');
    expect(text).not.toMatch(/composition/);
    expect(text).toMatch(/"a"/);
    expect(text).not.toMatch(/"a" \(/);
    expect(text).not.toMatch(/title: /);
    expect(text).not.toMatch(/abstract: /);
  });
  test('describes details for wms layers, but without redundancy 2', () => {
    // adjust singleWmsLayerDesc, so that infos are less perfect
    let clonedDesc = Object.assign({}, singleWmsLayerDesc) as LayerDescription;
    (clonedDesc.details as WMSLayerDetails).wmsLayerAbstracts = ['Humba']; // same as title
    (clonedDesc.details as WMSLayerDetails).wmsLayerTitles = ['Humba']; // same as abstract

    let descriptions: LayerDescription[] = [
      clonedDesc
    ];
    let got: string[] = layerDescriptionsToText(descriptions);
    let text = got.join('');
    expect(text).not.toMatch(/composition/);
    expect(text).toMatch(/"a" \(/);
    expect(text).not.toMatch(/title: /);
    expect(text).toMatch(/title\/abstract: /);
  });
  test('describes details for wms layers, handling empty infos 1', () => {
    // adjust singleWmsLayerDesc, so that infos are less perfect
    let clonedDesc = Object.assign({}, singleWmsLayerDesc) as LayerDescription;
    (clonedDesc.details as WMSLayerDetails).wmsLayerAbstracts = ['']; // no abstract

    let descriptions: LayerDescription[] = [
      clonedDesc
    ];
    let got: string[] = layerDescriptionsToText(descriptions);
    let text = got.join('');
    expect(text).not.toMatch(/composition/);
    expect(text).toMatch(/"a" \(/);
    expect(text).toMatch(/title: /);
    expect(text).not.toMatch(/abstract: /);
  });

  test('describes details for wms layers, handling empty infos 1', () => {
    // adjust singleWmsLayerDesc, so that infos are less perfect
    let clonedDesc = Object.assign({}, singleWmsLayerDesc) as LayerDescription;
    (clonedDesc.details as WMSLayerDetails).wmsLayerTitles = ['']; // no title

    let descriptions: LayerDescription[] = [
      clonedDesc
    ];
    let got: string[] = layerDescriptionsToText(descriptions);
    let text = got.join('');
    expect(text).not.toMatch(/composition/);
    expect(text).toMatch(/"a" \(/);
    expect(text).not.toMatch(/title: /);
    expect(text).toMatch(/abstract: /);
  });
});

