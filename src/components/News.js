import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";


export default class News extends Component {
  static defaultProps = {
    country: "in",
    pageSize: 8,
    category: "general",
  };
  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.string,
    category: PropTypes.string,
  };
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: true,
      page: 1,
      totalResults: 0
    };

    document.title =
      `${this.props.category} - NewsFlair`.charAt(0).toUpperCase() +
      `${this.props.category} - NewsFlair`.slice(1);
  }

  async componentDidMount() {
    this.updateNews();
  }

  async updateNews() {
    this.props.setProgress(0);
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    this.props.setProgress(30);
    let data = await fetch(url);
    this.props.setProgress(60);
    let parsedData = await data.json();
    this.props.setProgress(90);
    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading: false,
    });
    this.props.setProgress(100);
  };

  fetchMoreData = async () => {
    this.setState({ page: this.state.page + 1 }, async () => {
      console.log(this.state.page);
      const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
      let data = await fetch(url);
      let parsedData = await data.json();
      this.setState({
        articles: this.state.articles.concat(parsedData.articles),
        totalResults: parsedData.totalResults,

      });
    })
    //stupid this.state.page was not updating value first tym immeediatyly thats all code inside that thing lol
  };


  render() {
    return (
      <>
        <h6 className="display-6 text-center my-3">
          NewsFlair - Top {document.title.split(" ")[0]} Headlines
        </h6>
        {this.state.loading && <Spinner />}

        {/* infiinte scroll */}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<Spinner />}
        >

          <div className="container">
            <div className="row">
              {this.state.articles.map(element => {
                return (
                  <div className="col-md-4" key={element.url}>
                    <NewsItem
                      title={element.title ? element.title.slice(0, 44) : ""}
                      description={
                        element.description ? element.description.slice(0, 88) : ""
                      }
                      a
                      urlToImage={
                        element.urlToImage
                          ? element.urlToImage
                          : "https://media.istockphoto.com/id/1311148884/vector/abstract-globe-background.jpg?s=612x612&w=0&k=20&c=9rVQfrUGNtR5Q0ygmuQ9jviVUfrnYHUHcfiwaH5-WFE="
                      }
                      url={element.url}
                      source={element.source.name}
                      date={element.publishedAt}
                      author={element.author}
                    />
                  </div>
                );
              })}
            </div>
          </div>




        </InfiniteScroll>
      </>
    );
  }
}
