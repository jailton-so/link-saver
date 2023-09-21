module.exports = async function getWebPageOgMetaTags(url){
    const response = await fetch(url)
    const htmlAsString = await response.text()

    const headStartIndex = htmlAsString.indexOf('<head>')
    const headEndIndex = htmlAsString.indexOf('</head>')
    if(headStartIndex === -1 || headEndIndex === -1){
        return 'error: cannot get <head> tag'
    }
    const headtags = htmlAsString.substring(headStartIndex+'<head>'.length, headEndIndex).split('>')
    const metaTags = headtags.filter(line => {
        if(line.includes('="og:')){
            return line
        }
    })

    // search for specific tags
    const tagsToSearch = {
        title: 'og:title"',
        description: 'og:description',
        image: 'og:image"',
    }

    let content = {
        title: '',
        description: '',
        image: '',
    }
    
    for(const key in tagsToSearch){
        metaTags.forEach(e => {
            startIndex = e.indexOf(tagsToSearch[key])
            if(startIndex !== -1){
                contentStartIndex = e.indexOf('content="', startIndex)+'content="'.length
                contentEndIndex = e.indexOf('"', contentStartIndex)
                content[key] = e.substring(contentStartIndex, contentEndIndex)
            }
        })
    }
    
    return content
}