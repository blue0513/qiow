import R from 'ramda';
import MoveTo from 'moveto';

export const getTagItemsUrl = tagId => {
  return `https://qiita.com/api/v2/tags/${tagId}/items`;
}

export const moveTo = new MoveTo({
  duration: 300
});

export const pickTagId = R.prop('tagId');

export const uniqById = R.uniqBy(obj => obj.id);
