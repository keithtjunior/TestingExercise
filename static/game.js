class BoggleGame {
    constructor() {
      this.score = 0;
      this.topScore = 0;
      this.currentWord = '';
      this.wordsGuessed = [];
    }
    wordAdded(word){
        return this.wordsGuessed.includes(word);
    }
    addWord(word){
        this.currentWord = word;
        this.wordsGuessed.push(this.currentWord);
        if(word.length > this.topScore) this.topScore = word.length;
        this.score += word.length;
    }
    setCurrentWord(word){
        this.currentWord = word;
    }
    resetGame(){
        this.score = 0;
        this.topScore = 0;
        this.currentWord = '';
        this.wordsGuessed = [];
    }
}