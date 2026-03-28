module Jekyll
  class AccessibleHighlightBlock < Tags::HighlightBlock
    def initialize(tag_name, markup, tokens)
      # 1. Capture the full markup to extract our label
      @full_markup = markup.dup
      
      # 2. Extract just the first word (the language) for the parent class
      # This prevents the 'Syntax Error' during Jekyll's internal initialization
      clean_markup = markup.split.first || ""
      
      super(tag_name, clean_markup, tokens)
    end

    def render(context)
      parts = @full_markup.split
      lang = parts.first
      
      # 3. Extract the label (everything after the language)
      label = parts[1..-1].join(' ').gsub(/['"]/, '')
      label = "#{lang.upcase} code sample" if label.empty?


      # 4. Get the original HTML output from the parent
      original_output = super
      
      # 5. Inject attributes into the <figure> tag
      accessibility_attrs = %Q{tabindex="0" role="region" aria-label="#{label}"}
      original_output.sub('<figure', "<figure #{accessibility_attrs}")
    end
  end
end

Liquid::Template.register_tag('code_highlight', Jekyll::AccessibleHighlightBlock)
