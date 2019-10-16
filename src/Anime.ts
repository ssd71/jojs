/**
 * Used to process and store Anime objects
 */
class Anime {
  props: {
    [key: string]: any;
  } = {};

  /**
   * Instantiates an Anime Object using an array of attributes
   */
  constructor(public animeRaw: Array<string>) {
    this.get = this.get.bind(this);

    const propNames = [
      'aid',
      'eps',
      'count',
      'special_count',
      'year',
      'type',
      'romaji',
      'kanji',
      'english',
      'other',
      'short_names',
      'synonyms',
      'cat_list',
    ];

    for (let i = 0; i < propNames.length; i++) {
      this.props[propNames[i]] = animeRaw[i];
    }
  }

  /**
   * A getter for all the props for tidying purposes
   * @param {String} key The property to get
   * @return {String | number} The property itself
   */
  get(key: string): (string | number) {
    return this.props[key];
  }
}

export = Anime;
