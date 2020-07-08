# Start up the editor on all files
alias nedit-all="nedit-nc -g 111x40 \
    OblivCharPlanner.html \
    scripts/ocp.js \
    styles/ocp.css \
    dialogs/race.html \
    styles/race.css \
    scripts/ocp-race.js \
    scripts/ocp-birth.js \
    scripts/ocp-class.js \
    scripts/ocp-level.js \
    scripts/ocp-results.js \
    "

# Quick backup
alias backupcwd="tar cvzf backup-`date '+%Y%m%d'`.tar.gz --exclude=\*.tar.gz *"

# Print list of text files excluding .svn dirs
# -- Does not follow links so dojotoolkit is not found
function find_text_files {
  perl -e '
    use File::Find;
    sub prep() { return sort grep { not /^\.svn$/ and not /\.(png|gif|jpg|jpeg)$/ } @_; }
    sub want() { s!^\./!!; print if -T; }
    if ( $ARGV[0] eq "-0" ) { shift @ARGV; $\ = "\0"; } else { $\ = "\n"; }
    find( { wanted => \&want, preprocess => \&prep, no_chdir => 1, follow => 0 }, @ARGV );' -- "${@:-.}"
}

# Grep text files
alias grepcwd='find_text_files -0 . | xargs -0 grep'
#alias grepsrc='find_text_files -0 "$FLEXDKP_SOURCE_DIR" | xargs -0 grep'
#alias greppub='find_text_files -0 "$FLEXDKP_PUBLIC_DIR" | xargs -0 grep'
#alias grepzend='find_text_files -0 "$FLEXDKP_ZEND_DIR" | xargs -0 grep'

# Check text files for control characters and trailing whitespace
alias checkcwd='find_text_files -0 . | xargs -0 grep -E "([[:cntrl:]]|[[:space:]]\$)"'
#alias checksrc='find_text_files -0 $FLEXDKP_SOURCE_DIR | xargs -0 grep -E "([[:cntrl:]]|[[:space:]]\$)"'
#alias checkpub='find_text_files -0 $FLEXDKP_PUBLIC_DIR | xargs -0 grep -E "([[:cntrl:]]|[[:space:]]\$)"'

# Strip trailing whitespace from all lines in the given files
alias stripws="perl -i -pe 's/\s+\n$/\n/'"

# Untabify and remove all trailing whitespace
function cleandir {
  find_text_files "${@:-.}" | while read f
  do
    grep -l -E '[[:cntrl:]]' $f >/dev/null
    if [ $? -eq 0 ] ; then
      echo "Removing tabs from $f"
      tmp="/tmp/cleandir.$$"
      expand -t 4 $f >$tmp
      if [ \( $? -eq 0 \) -a \( -s $tmp \) ] ; then
        cp $tmp $f
        if [ $? -ne 0 ] ; then
          echo "Aborted due to failed copy!"
          return
        fi
        rm $tmp
      else
        echo "Aborted due to failed expand!"
        return
      fi
    fi
    grep -l -E '[[:space:]]$' $f >/dev/null
    if [ $? -eq 0 ] ; then
      echo "Stripping trailing whitespace from $f"
      perl -i -pe 's/\s+\n$/\n/' $f
    fi
  done
}

alias cleancwd='cleandir .'
#alias cleansrc='cleandir "$FLEXDKP_SOURCE_DIR"'
#alias cleanpub='cleandir "$FLEXDKP_PUBLIC_DIR"'

# Count lines in source text files that contain something alpha-numeric
function countdir {
    find_text_files "${@:-.}" | \
        grep -v setup.bash | \
        xargs grep -c '[:alnum:]' | \
        awk -F: '{total += $2; print} END { print "Total Lines =", total}'
}
alias countcwd='countdir .'
