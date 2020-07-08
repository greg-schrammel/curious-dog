#!/bin/sh

echo 'Fixing ViewPropTypes issues'
echo 'export const ViewPropTypes = { style: null };' >> '../node_modules/react-native-web/dist/index.js'
echo 'export const ViewPropTypes = { style: null }; export default ViewPropTypes;' >> '../node_modules/react-native-web/dist/exports/ViewPropTypes.js'