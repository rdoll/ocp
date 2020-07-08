#!/bin/echo Must be sourced via .

# This is a bash/ksh/sh compatible script that must be source'd
# into the current shell so environment variables, functions, and
# aliases can be set.

# Project root directory
export OCP_PROJ="/var/www/ocp"

# Ensure we are in a version under the root
if [ ".${PWD#$OCP_PROJ/}" = ".$PWD" ] ; then
    echo "Can only setup while under a version subdir of $OCP_PROJ."
    return 1
fi

# Get the version from the subdirectory name
export OCP_VER="${PWD#$OCP_PROJ/}"
export OCP_VER="${OCP_VER%%/*}"

# Root directory for this version
export OCP_ROOT="$OCP_PROJ/$OCP_VER"

# Quick CD shortcuts
function cdproj { cd "$OCP_PROJ${@:+/$@}" ;}
function cdtop { cd "$OCP_ROOT${@:+/$@}" ;}

# Function to get the version from the source
function ocpSourceVersion {
    perl -ne 'print $1 if /\sVERSION:[^\d]+([\d.]+)/' $OCP_ROOT/scripts/ocp.js
}

# Validate that the source version matches the directory version
function ocpValidateVersions {
    _srcver="`ocpSourceVersion`"
    if [ ".$OCP_VER" != ".$_srcver" ] ; then
        echo "Error: Source version $_srcver does not match directory" \
            "version $OCP_VER."
        unset _srcver
        return 1
    fi
    unset _srcver
    return 0
}

# If the source and dir versions don't match, return failure
ocpValidateVersions || return 1


# Define the files for the project
export OCP_SRC="\
    ocp.html \
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
alias nedit-all="nedit-nc -g 111x40 $OCP_SRC"


# Backup root directory
export OCP_BACKUP="$OCP_PROJ/backup"
function cdback { cd "$OCP_BACKUP${@:+/$@}" ;}

# Backup the current version
function backupsrc {
    ocpValidateVersions &&
    ( cd "$OCP_ROOT" &&
      tar -cvzf "$OCP_BACKUP/ocp-`date '+%Y%m%d'`-v$OCP_VER.tar.gz" .
    )
}

# Backup the original images
function backuporig {
    ( cd "$OCP_PROJ/original-images" &&
      tar -cvzf "$OCP_BACKUP/ocp-`date '+%Y%m%d'`-original-images.tar.gz" .
    )
}


# Print list of text files excluding .svn dirs
# -- Does not follow links so dojotoolkit is not found
function find_text_files {
  perl -e '
    use File::Find;
    sub prep() {
        return sort grep { not /^\.svn$/ and not /\.(png|gif|jpg|jpeg)$/ } @_;
    }
    sub want() { s!^\./!!; print if -T; }
    if ( $ARGV[0] eq "-0" ) { shift @ARGV; $\ = "\0"; } else { $\ = "\n"; }
    find( { wanted => \&want, preprocess => \&prep,
            no_chdir => 1, follow => 0 },
        @ARGV );' -- "${@:-.}"
}

# Grep text files
alias grepcwd='find_text_files -0 . | xargs -0 grep'
alias grepsrc='find_text_files -0 "$OCP_ROOT" | xargs -0 grep'
function grepver {
    if [ $# -lt 1 ] ; then
        echo "Error: grepver requires at least one argument."
        return 1
    else
        _ver="$1" ; shift
        find_text_files -0 "$OCP_PROJ/$_ver" | xargs -0 grep ${@:+"$@"}
    fi
}

# Check text files for control characters and trailing whitespace
alias checkcwd='find_text_files -0 . | xargs -0 grep -E "([[:cntrl:]]|[[:space:]]\$)"'
alias checksrc='find_text_files -0 "$OCP_ROOT" | xargs -0 grep -E "([[:cntrl:]]|[[:space:]]\$)"'

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
alias cleansrc='cleandir "$OCP_ROOT"'

# Count lines in source text files that contain something alpha-numeric
function countdir {
    find_text_files "${@:-.}" | \
        grep -v setup.bash | \
        grep -v '\.txt$' | \
        xargs grep -c '[:alnum:]' | \
        awk -F: '{ tot += $2; printf "%5d\t%s\n", $2, $1 } \
            END { printf "%5d\t%s\n", tot, "Total AlphaNum Lines" }'
}
alias countcwd='countdir .'
alias countsrc='countdir "$OCP_ROOT"'

# Count with plain wc
function wcdir {
    find_text_files "${@:-.}" | \
        grep -v setup.bash | \
        grep -v '\.txt$' | \
        xargs wc --chars --max-line-length --lines
}
alias wccwd='wcdir .'
alias wcsrc='wcdir "$OCP_ROOT"'

# Diff versus current source
# *** Be awesome if these could compare sub-dirs
# *** (e.g. while in .../ver2/scripts, diffcwd would only compare
# *** .../ver1/scripts to ../ver2/scripts)
function diffdir {
    if [ $# -lt 2 ] ; then
        echo "Error: diffdir requires at least two arguments."
        return 1
    else
        _dir1="$1" ; shift
        _dir2="$1" ; shift
        diff -r "$@" "$_dir1" "$_dir2"
    fi
}
alias diffcwd='diffdir "$OCP_ROOT" .'
function diffver {
    if [ $# -lt 1 ] ; then
        echo "Error: diffver requires at least one argument."
        return 1
    else
        _ver="$1" ; shift
        diff -r "$@" "$OCP_ROOT" "$OCP_PROJ/$_ver"
    fi
}


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


# Return success
return 0
