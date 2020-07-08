#!/bin/echo Must be sourced via .

# Define the files for the project
export SRC_FILES="\
    OblivCharPlanner.html \
    styles/ocp.css \
    scripts/ocp.js \
    scripts/ocp-input.js \
    scripts/ocp-race.js \
    scripts/ocp-birth.js \
    scripts/ocp-cclass.js \
    scripts/ocp-existing.js \
    scripts/ocp-order.js \
    scripts/ocp-level.js \
    scripts/ocp-results.js \
    scripts/widget/TitledContentPane.js \
    scripts/widget/LabeledHorizontalSlider.js \
    "

# Start up the editor on all files
alias nedit-all="nedit-nc -g 111x40 $SRC_FILES"

# Quick backup
function backupcwd {
    dat="`date '+%Y%m%d'`";
    ver="`perl -ne 'print $1 if /\sVERSION:[^\d]+([\d.]+)/' scripts/ocp.js`"
    tar -cvzf backup-$dat-v$ver.tar.gz \
        --exclude=\*.tar.gz \
        --exclude=images/birth/original \
        --exclude=images/class/original \
        --exclude=images/race/original \
        *
}
function backuporigcwd {
    dat="`date '+%Y%m%d'`";
    ver="`perl -ne 'print $1 if /\sVERSION:[^\d]+([\d.]+)/' scripts/ocp.js`"
    tar -cvzf backup-$dat-v$ver-plus-orig.tar.gz \
        --exclude=\*.tar.gz \
        *
}

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
        grep -v htaccess | \
        xargs grep -c '[:alnum:]' | \
        awk -F: '{ tot += $2; printf "%5d\t%s\n", $2, $1 } \
            END { printf "%5d\t%s\n", tot, "Total AlphaNum Lines" }'
}
alias countcwd='countdir .'

# Count with plain wc
alias wccwd="find_text_files . | \
    grep -v setup.bash | \
    grep -v htaccess | \
    xargs wc --chars --max-line-length --lines"

# Use GIMP to convert a PNG image to JPEG
# Derived from http://www.lemur.com/dmm/culch/scriptsfu/index.html#convertjpg
# I'm guessing this doesn't work for the class PNGs pulled from
# http://www.elderstats.com/about/?p=credits because they use transparency
# and that transparency must be explicitly flattened before this works well.
# Since I have no idea how to do that in GIMP LISP, I did the conversions
# manually instead :(.
function gimp-png-to-jpg {
    for x in "$@" ; do
        f="${x%.png}"
        if [ ".$f" == ".$x" ] ; then
            echo "Input file $x must end in .png!"
            return 1
        fi
        f="$f.jpg"
        echo "Converting $x to $f..."
        gimp -c -i -d -b - <<EOS
(define (dmmConvertPNGtoJPG infile outfile)
   (let* ((image (car (file-png-load 1 infile infile)))
          (drawable (car (gimp-image-active-drawable image)))
         )

         (file-jpeg-save 1 image drawable outfile outfile
              0.75 0 1 1 "GIMP" 0 1 0 0 )
            ; 0.75 quality (float 0 <= x <= 1)
            ;      0 smoothing factor (0 <= x <= 1)
            ;        1 optimization of entropy encoding parameter (0/1)
            ;          1 enable progressive jpeg image loading (0/1)
            ;            "xxxx"  image comment
            ;                   0 subsampling option number
            ;                     1 force creation of a baseline JPEG
            ;                       0 frequency of restart markers
            ;                         in rows, 0 = no restart markers
            ;                         0 DCT algoritm to use
   )
)
(dmmConvertPNGtoJPG "$x" "$f")
(gimp-quit 0)
EOS
    done
}
