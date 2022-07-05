import React, { Component } from 'react'
import Newsitem from './Newsitem';
import Spinner from './Spinner';
import PropTypes from 'prop-types'

export class News extends Component {

    static defaultProps = {
        country: "us",
        pageSize: 5,
        category: "general"
    }
    static propTypes = {
        country: PropTypes.string,
        pageSize: PropTypes.string,
        category: PropTypes.string
    }

    capitalizedFirstLetter = (string)=>{
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    constructor(props){
        super(props);
        this.state = {
            articles: [],
            loading: false,
            page: 1
        }
        document.title = `MRD News - ${this.capitalizedFirstLetter(this.props.category)}`;
    }
    async componentDidMount(){
        this.props.setProgress(10);
      let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=ca41916a18d84274949bd0faedd315f5&page=1&pageSize=${this.props.pageSize}`;
      this.setState({loading: true});
     let data = await fetch(url);
     let parseData = await data.json()
     this.setState({articles: parseData.articles, totalResults: parseData.totalResults, loading: false})
     this.props.setProgress(100);
    }

    handleNextClick = async ()=> {
        if(!(this.state.page + 1 > Math.ceil(this.state.totalResults/this.props.pageSize))){
            this.props.setProgress(10);
            let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=ca41916a18d84274949bd0faedd315f5&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;
            this.setState({loading: true});
           let data = await fetch(url);
           let parseData = await data.json()

        this.setState({
            page: this.state.page + 1,
            articles: parseData.articles,
            loading: false
        })
        this.props.setProgress(100);
        }
    }

    handlePrevClick = async ()=> {
        this.props.setProgress(10);
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=ca41916a18d84274949bd0faedd315f5&page=${this.state.page - 1}&pageSize=${this.props.pageSize}`;
        this.setState({loading: true});
        let data = await fetch(url);
        let parseData = await data.json()

     this.setState({
         page: this.state.page - 1,
         articles: parseData.articles,
            loading: false
     })
     this.props.setProgress(100);
    }

  render() {
    return (
        <div className='container my-5'>
            <h2 className='text-center' style={{marginTop:'100px'}}><strong>MRD News - Top Headlines on {this.capitalizedFirstLetter(this.props.category)}</strong></h2>
            {this.state.loading && <Spinner/>}
            <div className="row">
                {!this.state.loading && this.state.articles.map((element) => {
                  return  <div className="col-md-4"  key={element.url}>
                        <Newsitem title={element.title?element.title.slice(0, 20):""} description={element.description?element.description.slice(0, 70):""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                    </div>
                })
                }
            </div>
            <div className="container my-5 d-flex justify-content-between">
                <button disabled={this.state.page<=1} type="button" className="btn btn-dark" onClick={this.handlePrevClick}>&larr; Previous</button>
                <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResults/this.props.pageSize)} type="button" className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr;</button>
            </div>
        </div>
    )
  }
}

export default News
