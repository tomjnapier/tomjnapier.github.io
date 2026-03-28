module Jekyll
  class AccessibleHighlightBlock < Tags::HighlightBlock
    def render(context)
      # 1. Capture the full markup (e.g., 'html "My Label"')
      full_markup = @markup.dup
      
      # 2. Extract the first word as the language
      lang = full_markup.split.first
      
      # 3. Extract the label (everything after the language)
      label = full_markup.split[1..-1].join(' ').gsub(/['"]/, '')
      label = "#{lang.upcase} code sample" if label.empty?

      # 4. CRITICAL: Clean @markup so the original 'super' only sees the language
      # This prevents the "Syntax Error in tag 'highlight'"
      @markup = lang 

      # 5. Get the original output
      original_output = super
      
      # 6. Inject attributes into the <figure> tag
      accessibility_attrs = %Q{tabindex="0" role="region" aria-label="#{label}"}
      original_output.sub('<figure', "<figure #{accessibility_attrs}")
    end
  end
end

Liquid::Template.register_tag('code_highlight', Jekyll::AccessibleHighlightBlock)
